import { test as base } from '@playwright/test';
import { ProjectEditorPage } from '../page-objects/project/edit-project/project-editor-page';
import { ProjectSettingsPage } from '../page-objects/project/project-settings-page';
import { ProjectsPage } from '../page-objects/project/projects-page';

type Fixtures = {
  projectsPage: ProjectsPage,
  projectEditorPage: ProjectEditorPage,
  projectSettingsPage: ProjectSettingsPage
}

export const test = base.extend<Fixtures>({
  projectsPage: async ({ page }, use) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.goto();
    await use(projectsPage);
  },
  projectEditorPage: async ({ page }, use) => {
    const projectEditorPage = new ProjectEditorPage(page);
    await use(projectEditorPage);
  },
  projectSettingsPage: async ({ page }, use) => {
    const projectsSettingsPage = new ProjectSettingsPage(page);
    await use(projectsSettingsPage);
  }
});

export { expect } from '@playwright/test';
