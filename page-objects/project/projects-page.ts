import { expect, Locator, Page } from '@playwright/test';
import { URL } from '../../constants';
import { ProjectHeader } from './edit-project/project-header';
import { NewProjectDialog } from './new-project-dialog';

export class ProjectsPage {
    readonly page: Page;
    readonly newProjectDialog: NewProjectDialog;
    readonly projectNames: Locator;
    readonly newProjectButton: Locator;
    readonly projectHeader: ProjectHeader;

    constructor(page: Page) {
        this.page = page;
        this.newProjectDialog = new NewProjectDialog(page);
        this.newProjectButton = page.locator('button[data-name="add-project"]');
        this.projectNames = page.locator('[data-name="project-sidebar"] a[href^="/project/"]');
    }

    async goto() {
        await this.page.goto(URL.PROJECTS);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async clickNewProjectButton() {
        await this.newProjectButton.click();
        await expect(this.newProjectDialog.modalTitle).toBeVisible();
    }

    async createProject(name: string, targetLanguage: string) {
        await this.page.goto(URL.NEW_PROJECT);
        await this.newProjectDialog.fillInMandatoryFields(name, targetLanguage);
    }

    async getDisplayedProjects() {
        return await this.projectNames.allTextContents();
    }

    async assertProjectLanguages(projectName: string, expectedLanguagesList: string[]) {
        var actualProjectLanguages = await this.page.locator(`[data-name="project-container"]:has-text("${projectName}") [data-name="project-language"] a`)
            .allTextContents();
        var expectedLanguagesList = expectedLanguagesList.map(elem => elem.substring(0, elem.indexOf(" ")).trim());
        expect(actualProjectLanguages).toEqual(expectedLanguagesList);
    }
}