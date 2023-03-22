import { Locator, Page } from '@playwright/test';
import { ProjectHeader } from './project-header';

export class ProjectEditorHeader extends ProjectHeader {
    readonly page: Page;
    readonly keysCount: Locator;
    readonly baseWordsCount: Locator;
    readonly editorPanel: Locator;
    readonly languagesContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.editorPanel = page.locator('.editor-panel');
        this.languagesContainer = page.locator('.languages-container');
    }
}