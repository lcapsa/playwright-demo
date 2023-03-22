import { expect, Locator, Page } from '@playwright/test';

export class DeleteProjectDialog {
    readonly page: Page;
    readonly projectNameInput: Locator;
    readonly deleteProjectButton: Locator;
    readonly confirmDeleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.projectNameInput = page.locator('form .bootbox-input');
        this.deleteProjectButton = page.locator('.project-delete');
        this.confirmDeleteButton = page.locator('button[data-bb-handler="confirm"]');
    }

    async clickDeleteButton() {
        await expect(this.deleteProjectButton).toBeVisible();
        await this.deleteProjectButton.scrollIntoViewIfNeeded();
        await this.deleteProjectButton.click();
    }

    async fillInDialog(projectName: string) {
        await this.clickDeleteButton();
        await expect(this.projectNameInput).toBeVisible();
        await this.projectNameInput.type(projectName);
        await Promise.all([
            this.page.waitForResponse('**/project/delete'),
            this.confirmDeleteButton.click()
        ]);
        await expect(this.projectNameInput).toBeHidden();
    }
}