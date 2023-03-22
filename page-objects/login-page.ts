import { expect, Locator, Page } from '@playwright/test';
import { MAIN_PAGE_TITLE } from '../constants';
import credentials from '../credentials.json';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('form input[placeholder="user@company.com"]');
        this.passwordInput = page.locator('form input[type="password"]');
        this.loginButton = page.locator('form button');
    }

    async login() {
        await this.emailInput.type(credentials.user1.email);
        await this.passwordInput.type(credentials.user1.password);
        await this.loginButton.click();
        await expect(this.page).toHaveTitle(MAIN_PAGE_TITLE);
    }
}