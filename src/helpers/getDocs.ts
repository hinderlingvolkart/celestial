import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { glob } from "glob";
import type {CelestialDoc} from "../types.ts";
import {ORIG_COMPONENTS_DIR, ORIG_GLOB} from "./constants.js";
import {getCode, getSubDocs} from "./subDocs.js";
import {slugify, slugifyPath} from "./string.js";
import {getAsDom} from "./parseAstro.js";

const possibleExtensions = ['astro', 'vue', 'svelte', 'jsx'];
export async function loadDocs(docPath: string): Promise<CelestialDoc[]> {
    const docs: CelestialDoc[] = [];

    try {
        const fileName = docPath.split('/').at(-1) || '';
        const componentName = fileName.split('.').at(0) || '';
        const basePath = docPath
            .replace('Docs.astro', '');

        const componentExtensions = possibleExtensions.filter(extension => {
            const checkComponentPath = `${basePath}.${extension}`;
            return existsSync(checkComponentPath);
        })

        /*
        if (!componentExtensions.length) {
            throw new Error(`⚠️ No component found for docs at ${docPath}, skipping this file`);
        }
        */

        if (componentExtensions.length > 1) {
            throw new Error(`⚠️ Multiple components with different filetypes found for docs at ${docPath}, skipping this file`);
        }

        const path = basePath.replace(ORIG_COMPONENTS_DIR, '');

        const originalContent = readFileSync(docPath, 'utf-8');
        const originalContentAsDocument = getAsDom(originalContent);
        const subDocs = getSubDocs(originalContentAsDocument);
        // const codeForSubDocs = getCode(originalContentAsDocument);
        const code = originalContent.split('---').at(-1).replace(/`/g, '\`')

        docs.push({
            name: componentName,
            slug: slugify(componentName),
            path,
            pathSlug: slugifyPath(path),
            docPath,
            subDocs,
            code
        });
    } catch(error: unknown) {
        if (error instanceof Error && error.message) {
            console.warn(error.message);
        } else {
            console.warn(error);
        }
    }

    return docs;
}

export async function getDocs(): Promise<CelestialDoc[]> {
    const docPaths = await glob(ORIG_GLOB);

    let loadedStories: CelestialDoc[] = [];

    for (const docPath of docPaths) {
        const stories = await loadDocs(docPath);
        loadedStories = [...loadedStories, ...stories];
    }

    return loadedStories;
}
