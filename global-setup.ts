import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from './page-objects/login-page';

async function globalSetup(config: FullConfig) {
    const { baseURL, storageState } = config.projects[0].use;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);

    await page.goto(baseURL!);
    await loginPage.login();
    await page.context().storageState({ path: storageState as string });
    await browser.close();
}

export default globalSetup;