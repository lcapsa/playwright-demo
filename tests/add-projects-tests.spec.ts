import { expect } from '@playwright/test';
import { LANGUAGE, URL } from '../constants';
import { test } from './project';

test.describe('Given there is no project created', () => {
    var projectId = "";

    test.beforeEach(async ({ projectsPage }) => {
        expect(await projectsPage.getDisplayedProjects()).toHaveLength(0);
    });

    test('Case 1: Add first project', async ({ projectsPage, projectEditorPage, page, baseURL }) => {
        await projectsPage.clickNewProjectButton();
        await expect(page).toHaveURL(baseURL + URL.NEW_PROJECT);
        const projectName = 'Test' + new Date(Date.now()).toISOString();
        await projectsPage.createProject(projectName, LANGUAGE.AFAR);

        await expect(projectEditorPage.projectName).toHaveText(projectName);
        projectId = await projectEditorPage.getProjectId();
        await expect(page).toHaveURL(baseURL + URL.PROJECT + projectId + URL.PROJECT_EDITOR);

        await projectsPage.goto();
        expect(await projectsPage.getDisplayedProjects()).toEqual([projectName]);
        await projectsPage.assertProjectLanguages(projectName, [LANGUAGE.BASE_DEFAULT, LANGUAGE.AFAR]);
    });

    test.afterEach(async ({ projectsPage, projectSettingsPage }) => {
        await projectSettingsPage.deleteProject(projectId);
        expect(await projectsPage.getDisplayedProjects()).toHaveLength(0);
    });
});

test.describe('Given there is exactly one project created', () => {
    var projectIds = [];
    var projectName: string;

    test.beforeEach(async ({ projectsPage, projectEditorPage }) => {
        // Note: ideally creating the prerequisite would be by api call or database, but without that option for now will use UI
        projectIds = [];
        expect(await projectsPage.getDisplayedProjects()).toHaveLength(0);
        projectName = 'Test' + new Date(Date.now()).toISOString();
        await projectsPage.createProject(projectName, LANGUAGE.AFAR);
        projectIds.push(await projectEditorPage.getProjectId());
    });

    test('Case 2: Add nth project', async ({ projectsPage, projectEditorPage, page, baseURL }) => {
        const newProjectName = 'Test' + new Date(Date.now()).toISOString();
        await projectsPage.createProject(newProjectName, LANGUAGE.ENGLISH);
        var newProjectId = await projectEditorPage.getProjectId();
        projectIds.push(newProjectId);
        await expect(page).toHaveURL(baseURL + URL.PROJECT + newProjectId + URL.PROJECT_EDITOR);

        await projectsPage.goto();
        await expect(page).toHaveURL(baseURL + URL.PROJECTS);
        expect(await projectsPage.getDisplayedProjects()).toEqual([projectName, newProjectName]);
    });

    test.afterEach(async ({ projectSettingsPage, projectsPage }) => {
        //  Note: ideally creating the prerequisite would be by calling api or database, but without that option for now will use UI
        //  ?? seems to be a bug here - sometimes when deleting the second project an error is thrown: An unexpected error has occurred. Contact Lokalise support in the in-app web chat.
        await projectSettingsPage.deleteProjectsById(projectIds);
        expect(await projectsPage.getDisplayedProjects()).toHaveLength(0);
    });
})