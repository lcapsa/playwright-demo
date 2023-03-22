import { Locator, Page } from '@playwright/test';
import { URL } from '../../../constants';

export class ProjectHeader {
    readonly page: Page;
    readonly projectName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.projectName = page.locator('a[aria-current="page"]');
    }

    async getProjectId() {
        await this.projectName.waitFor();
        return (await this.projectName.getAttribute('href')).replace(URL.PROJECT, '').replace('/', '');
    }
}