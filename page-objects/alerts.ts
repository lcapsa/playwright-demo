import { Locator, Page } from '@playwright/test';

export class Alerts {
    readonly page: Page;
    readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successAlert = this.page.locator('.alert-success');
    }
}