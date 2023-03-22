import { expect, Locator, Page } from '@playwright/test';
import { KEYBOARD } from '../../constants';

export class NewProjectDialog {
    readonly page: Page;
    readonly modalTitle: Locator;
    readonly projectName: Locator;
    readonly targetLanguagesDropdown: Locator;
    readonly proceedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalTitle = page.locator('div[aria-modal="true"] header');
        this.projectName = page.locator('input[name="name"]');
        this.targetLanguagesDropdown = page.locator('input[type="text"][aria-labelledby="TargetLanguage"]');
        this.proceedButton = page.locator('#tabs--1--panel--0 button[type="submit"]');
    }

    async fillInMandatoryFields(name: string, targetLanguage: string) {
        await expect(this.modalTitle).toHaveText('Add project');
        await this.projectName.type(name);
        await this.targetLanguagesDropdown.scrollIntoViewIfNeeded();
        await this.targetLanguagesDropdown.type(targetLanguage);
        await this.page.keyboard.press(KEYBOARD.ENTER);
        await this.proceedButton.click();
        await this.page.waitForLoadState("domcontentloaded");
    }
}