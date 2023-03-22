import { expect, Locator, Page } from "@playwright/test";
import { KEYBOARD, URL } from "../../../../constants";

export class KeyEditorDialog {
    readonly page: Page;
    readonly modalTitle: Locator;
    readonly keyName: Locator;
    readonly platform: Locator;
    readonly saveButton: Locator;
    readonly advancedTab: Locator;
    readonly pluralOption: Locator;

    constructor(page: Page) {
        this.page = page
        this.modalTitle = this.page.locator('#addkey .modal-title');
        this.keyName = this.page.locator('#keyName');
        this.platform = this.page.locator('#s2id_device-s input');
        this.saveButton = this.page.locator('#btn_addkey');
        this.advancedTab = this.page.locator('#advanced_tab');
        this.pluralOption = this.page.locator('.col-sm-3 .bootstrap-switch');
    }

    async fillInFields(name: string, platform: string, isPlural: boolean) {
        await expect(this.modalTitle).toHaveText("Key editor");
        await this.keyName.type(name);
        await this.platform.type(platform);
        await this.page.keyboard.press(KEYBOARD.ENTER);
        if (isPlural) {
            await this.selectPluralOption();
        }
        await Promise.all([
            this.saveButton.click(),
            this.page.waitForResponse('**/add_key'),
            this.page.waitForResponse('**/filter/data?'),
            this.page.waitForResponse(`**${URL.PROJECT_EDITOR}**`),
        ]);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async selectPluralOption() {
        await this.advancedTab.click();
        await this.pluralOption.click();
    }
}