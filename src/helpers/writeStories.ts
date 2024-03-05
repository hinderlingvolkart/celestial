import path from "node:path";
import { writeFile } from 'fs';
import { emptyDirSync, ensureDirSync } from 'fs-extra';
import type {CelestialStory} from "../types.ts";
import {STYLEGUIDE_PAGE_DIR} from "./constants.js";

export function writeStory(story: CelestialStory): Promise<void> {
    return new Promise(resolve => {
        const targetPath = story.config.docsPath.toLowerCase();
        ensureDirSync(targetPath);
        const targetFile = path.join(targetPath, `${story.name}.astro`).toLowerCase();

        writeFile(targetFile, story.content, (error) => {
            if (error) {
                console.warn('🚨 Could not write file', targetFile);
            } else {
                console.log('💧 Generated doc page for', `${story.config.componentName} – ${story.name}`);
            }

            resolve();
        });
    })
}

export async function writeAllStories(stories: CelestialStory[]) {
    const targetPath = STYLEGUIDE_PAGE_DIR;
    emptyDirSync(targetPath);
    const storyGenerators: Promise<void>[] = stories.map(story => writeStory(story));

    return Promise.all(storyGenerators);
}
