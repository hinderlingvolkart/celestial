import path from "node:path";
import { writeFile } from 'fs';
import { emptyDirSync, ensureDirSync } from 'fs-extra';
import type {CelestialDoc} from "../types.ts";
import {STYLEGUIDE_PAGE_DIR} from "./constants.js";
import {generateDocsPage} from "../lib/generators/generateDocsPage.js";

export function writeDoc(doc: CelestialDoc): Promise<void> {
    return new Promise(resolve => {
        const targetPath = path.join(STYLEGUIDE_PAGE_DIR, doc.pathSlug);
        ensureDirSync(targetPath);
        const targetFile = path.join(targetPath, '[...slug].astro');

        writeFile(targetFile, generateDocsPage(targetPath, doc), (error) => {
            if (error) {
                console.warn('🚨 Could not write file', targetFile);
            } else {
                console.log('💧 Generated doc page', targetFile);
            }

            resolve();
        });
    })
}

export async function writeAllDocs(docs: CelestialDoc[]) {
    emptyDirSync(STYLEGUIDE_PAGE_DIR);
    const docCreators: Promise<void>[] = docs.map(doc => writeDoc(doc));

    return Promise.all(docCreators);
}
