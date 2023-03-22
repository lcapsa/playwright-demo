import { expect, Locator, Page } from '@playwright/test';
import { URL } from '../../../constants';
import { KeyEditorDialog } from './keys/key-editor-dialog';
import { KeyTranslationsTable } from './keys/key-translations-table';
import { ProjectEditorHeader } from './project-editor-header';

export class ProjectEditorPage extends ProjectEditorHeader {
    readonly page: Page;
    readonly addFirstKeyButton: Locator;
    readonly keyNames: Locator;
    readonly keysCount: Locator;
    readonly baseWordsCount: Locator;
    readonly pluralLabel: Locator;
    readonly keyEditorDialog: KeyEditorDialog;
    readonly keyTranslationsPage: KeyTranslationsTable;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.keyEditorDialog = new KeyEditorDialog(page);
        this.addFirstKeyButton = page.locator('button[aria-label="Add first key"]');
        this.keyNames = page.locator('.row-key a.edit-key');
        this.keysCount = page.locator('#header-key-count');
        this.baseWordsCount = page.locator('#header-source-word-count');
        this.pluralLabel = page.locator('.label-plural');
    }

    async goto(projectId: string) {
        await this.page.goto(URL.PROJECT + projectId + URL.PROJECT_EDITOR);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async createKey(name: string, platform: string, isPlural?: boolean) {
        await this.addFirstKeyButton.waitFor();
        await this.addFirstKeyButton.click();
        await this.keyEditorDialog.fillInFields(name, platform, isPlural);
        await this.page.locator('#endless').waitFor();
        await this.keyNames.waitFor();
    }

    async getDisplayedKeyNames() {
        await expect(this.keyNames).toBeVisible();
        return (await this.keyNames.allTextContents()).toString().trim();
    }
}