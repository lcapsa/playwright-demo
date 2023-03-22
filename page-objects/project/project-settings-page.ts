import { expect, Page } from '@playwright/test';
import { URL } from '../../constants';
import { Alerts } from '../alerts';
import { DeleteProjectDialog } from "../project/delete-project-dialog";
import { ProjectHeader } from './edit-project/project-header';

export class ProjectSettingsPage extends ProjectHeader {
    readonly page: Page;
    readonly deleteProjectDialog: DeleteProjectDialog;
    readonly alert: Alerts;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.deleteProjectDialog = new DeleteProjectDialog(page);
        this.alert = new Alerts(page);
    }

    async goto(projectId: string) {
        await this.page.goto(URL.SETTINGS + projectId + "/");
        await this.page.waitForLoadState();
    }

    async deleteProject(projectId: string) {
        await this.goto(projectId);
        await this.deleteProjectDialog.fillInDialog(await this.projectName.textContent());
        await expect(this.alert.successAlert).toBeVisible();
    }

    async deleteProjectsById(projectIds: string | any[]) {
        for (var i = 0; i < projectIds.length; i++) {
            await this.deleteProject(projectIds[i]);
        }
    }
}