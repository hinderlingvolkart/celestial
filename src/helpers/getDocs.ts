import path from "node:path";
import { existsSync } from "node:fs";
import { glob } from "glob";
import {generateStoryPage} from "./generateStoryPage.js";
import type {Celestial, CelestialStory, CelestialStoryConfig} from "../types.ts";
import {ORIG_COMPONENTS_DIR, ORIG_GLOB, STYLEGUIDE_PAGE_DIR} from "./constants.js";

const possibleExtensions = ['astro', 'vue', 'svelte', 'jsx'];
export async function loadDocs(docPath: string): Promise<CelestialStory[]> {
    const cacheBuster = `?version=${Date.now()}`; // force re-importing module on changed
    const docsModule = await import(`${docPath}${cacheBuster}`);
    const stories: CelestialStory[] = [];

    try {
        const fullName = docPath.split('/').at(-1) || '';
        const componentName = fullName.split('.').at(0) || '';
        const componentBasePath = docPath
            .replace('.docs.js', '')
            .replace('.docs.ts', '');

        const componentExtensions = possibleExtensions.filter(extension => {
            const checkComponentPath = `${componentBasePath}.${extension}`;
            return existsSync(checkComponentPath);
        })

        if (!componentExtensions.length) {
            throw new Error(`⚠️ No component found for docs at ${docPath}, skipping this file`);
        }

        if (componentExtensions.length > 1) {
            throw new Error(`⚠️ Multiple components with different filetypes found for docs at ${docPath}, skipping this file`);
        }

        const componentPath = `${componentBasePath}.${componentExtensions[0]}`;
        const componentsDirectory = componentBasePath.replace(ORIG_COMPONENTS_DIR, '').replace(`/${componentName}`, '');
        const docsDirectory = path.join(componentsDirectory, componentName);
        const docsPath = path.join(STYLEGUIDE_PAGE_DIR, docsDirectory);

        for (const [storyName, storyConfig ] of Object.entries(docsModule)) {
            const docs = storyConfig as unknown as Celestial;
            const { _celestialBase: base, ...props } = docs;
            const config: CelestialStoryConfig = {
                ...base,
                componentName,
                componentPath,
                docsPath,
                docsDirectory,
                props
            };

            const content = generateStoryPage(config);

            stories.push({
                name: storyName,
                config,
                content
            });
        }
    } catch(error: unknown) {
        if (error instanceof Error && error.message) {
            console.warn(error.message);
        } else {
            console.warn(error);
        }
    }

    return stories;
}

export async function getDocs(): Promise<CelestialStory[]> {
    const docPaths = await glob(ORIG_GLOB);
    let loadedStories: CelestialStory[] = [];

    for (const docPath of docPaths) {
        const stories = await loadDocs(docPath);
        loadedStories = [...loadedStories, ...stories];
    }

    return loadedStories;
}
