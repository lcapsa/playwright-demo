import { expect, Page } from '@playwright/test';

const KEY_REGEX = '{key}';
const LANGUAGE_REGEX = '{language}';

export class KeyTranslationsTable {
    readonly page: Page;
    readonly languages: string;
    readonly translations: string;
    readonly pluralTranslationLabels: string;

    constructor(page: Page) {
        this.page = page;
        this.languages = `#endless-keys-container:has-text("${KEY_REGEX}") td.cell-trans-lang`;
        this.translations = `#endless-keys-container:has-text("${KEY_REGEX}") .translation .highlight`;
        this.pluralTranslationLabels = `#endless-keys-container:has-text("${KEY_REGEX}") .translation:has-text("${LANGUAGE_REGEX}") .lokalise-plural-key`;
    }

    parseLanguage(language: string) {
        return language.substring(0, language.indexOf(' ')).trim();
    }

    async getLanguages(keyName: string) {
        return await this.page.locator(this.languages.replace(KEY_REGEX, keyName)).allTextContents();
    }

    async getTranslationsOfKey(key: string) {
        var translationElements = this.page.locator(this.translations.replace(KEY_REGEX, key));
        return Array.from(await translationElements.allTextContents()).map(elem => elem.trim());
    }

    async getPluralLabels(key: string, language: string) {
        return await this.page.locator(this.pluralTranslationLabels.replace(KEY_REGEX, key).replace(LANGUAGE_REGEX, this.parseLanguage(language))).allTextContents();
    }

    async assertLanguagesOfKey(key: string, expectedLanguagesList: string[]) {
        var actualLanguagesList = Array.from(await this.getLanguages(key)).map(language => language.trim());
        expectedLanguagesList = expectedLanguagesList.map(language => this.parseLanguage(language));
        expect(actualLanguagesList).toEqual(expectedLanguagesList);
    }

    async typeAndSave(translation: string) {
        const inputLocator = this.page.locator('.cm-s-default .CodeMirror-line');
        await inputLocator.type(translation);
        await Promise.all([
            this.page.waitForResponse('**/translation/*/update'),
            this.page.locator('button.save').click()
        ]);
        await expect(inputLocator).toBeHidden();
    }

    async edit(key: string, language: string, translations: string[], pluralItems?: string[]) {
        if (pluralItems) {
            for (var i = 0; i < translations.length; i++) {
                var locator = `.row-key:has-text("${key}") .translation:has-text("${this.parseLanguage(language)}") .lokalise-plural-item:has-text("${pluralItems[i]}") .highlight`;
                await this.page.locator(locator).click();
                await this.typeAndSave(translations[i]);
            }
        } else {
            await this.page.locator(`.row-key:has-text("${key}") .translation:has-text("${this.parseLanguage(language)}") .highlight`)
                .click();
            await this.typeAndSave(translations[0]);
        }
    }

}