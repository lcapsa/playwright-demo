import { expect } from '@playwright/test';
import { KEY_PLATFORM, LANGUAGE, URL } from '../constants';
import { KeyTranslationsTable } from '../page-objects/project/edit-project/keys/key-translations-table';
import { test } from './project';

const EMPTY = "Empty";

test.describe('Edit project > Add key', () => {
    var projectId = "";
    var translationsTable: KeyTranslationsTable;

    test.beforeEach(async ({ projectsPage, projectEditorPage, page }) => {
        // Note: ideally creating the prerequisite would be by api call or database, but without that option for now will use UI
        expect(await projectsPage.getDisplayedProjects()).toHaveLength(0);
        await projectsPage.createProject('Project' + new Date(Date.now()).toISOString(), LANGUAGE.AFAR);
        projectId = await projectEditorPage.getProjectId();
        translationsTable = new KeyTranslationsTable(page);
    });

    test('Case 3: Add first key', async ({ projectEditorPage, page, baseURL }) => {
        const keyName = 'Key' + new Date(Date.now()).toISOString();
        await projectEditorPage.createKey(keyName, KEY_PLATFORM.ANDROID);

        await expect(page).toHaveURL(baseURL + URL.PROJECT + projectId + URL.PROJECT_EDITOR);
        await expect(projectEditorPage.editorPanel).toBeVisible();
        await expect(projectEditorPage.languagesContainer).toBeVisible();
        var expectedKeys = [keyName];
        expect(await projectEditorPage.getDisplayedKeyNames()).toEqual(expectedKeys[0]);
        expect(await translationsTable.assertLanguagesOfKey(keyName, [LANGUAGE.BASE_DEFAULT, LANGUAGE.AFAR]));
        expect(await translationsTable.getTranslationsOfKey(keyName)).toEqual([EMPTY, EMPTY]);

        // Note: keys and baseword counters are displayed only after refresh. Not sure if this is the expected behaviour?
        await page.reload();
        await expect(projectEditorPage.keysCount).toHaveText(expectedKeys.length.toString());
        await expect(projectEditorPage.baseWordsCount).toHaveText('0');
    });

    test('Case 4: Add translation for key', async ({ projectEditorPage }) => {
        const keyName = 'Key' + new Date(Date.now()).toISOString();
        await projectEditorPage.createKey(keyName, KEY_PLATFORM.ANDROID);
        const translation = ["translated"];
        await translationsTable.edit(keyName, LANGUAGE.BASE_DEFAULT, translation);
        expect(await translationsTable.getTranslationsOfKey(keyName)).toEqual(translation.concat([EMPTY]));
    });

    test('Case 5: Add translation for plural key', async ({ projectEditorPage }) => {
        const keyName = 'Key' + new Date(Date.now()).toISOString();
        await projectEditorPage.createKey(keyName, KEY_PLATFORM.ANDROID, true);
        expect(await projectEditorPage.getDisplayedKeyNames()).toEqual(keyName);
        expect(await translationsTable.assertLanguagesOfKey(keyName, [LANGUAGE.BASE_DEFAULT, LANGUAGE.AFAR]));
        await expect(projectEditorPage.pluralLabel).toBeVisible();
        const defaultPluralItems = ["ONE", "OTHER"];
        const secondPluralItems = ["ZERO", "ONE", "TWO", "FEW", "MANY", "OTHER"];
        expect(await translationsTable.getPluralLabels(keyName, LANGUAGE.BASE_DEFAULT)).toEqual(defaultPluralItems);
        expect(await translationsTable.getPluralLabels(keyName, LANGUAGE.AFAR)).toEqual(secondPluralItems);

        const inputTransDefaults = ["one", "other"];
        const inputTransSecond = ["0", "1", "2", "few", "many", "other"];
        await translationsTable.edit(keyName, LANGUAGE.BASE_DEFAULT, inputTransDefaults, defaultPluralItems);
        await translationsTable.edit(keyName, LANGUAGE.AFAR, inputTransSecond, secondPluralItems);
        expect(await translationsTable.getTranslationsOfKey(keyName)).toEqual(inputTransDefaults.concat(inputTransSecond));
    });

    test.afterEach(async ({ projectsPage, projectSettingsPage }) => {
        //  Note: ideally creating the prerequisite would be by calling api or database, but without that option for now will use UI
        await projectSettingsPage.deleteProject(projectId);
        expect(await projectsPage.getDisplayedProjects()).toHaveLength(0);
    });
});