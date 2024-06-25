import path from "node:path";
import {copy, outputFile} from "fs-extra";
import {getConfig} from "./config.js";
import {
    CELESTIAL_DIR,
    CELESTIAL_TMP_SUBDIR,
    ORIG_DIR,
    STYLEGUIDE_DIR,
    STYLEGUIDE_LAYOUT_DIR,
    STYLEGUIDE_SRC_DIR, WORKSPACE_ROOT
} from "./constants.js";
import {layoutMainTemplate} from "../templates/LayoutMain.template.js";

export async function copyAdditionalFilesAndFolders(): Promise<void[]> {
    const config = getConfig();

    if (!config.copyAdditional) {
        return;
    }

    const folders = Array.isArray(config.copyAdditional) ? config.copyAdditional : [config.copyAdditional];
    const promises: Promise<void>[] = folders.map(folderName => {
        const sourcePath = path.join(ORIG_DIR, folderName);
        const targetPath = path.join(CELESTIAL_TMP_SUBDIR, folderName);

        return new Promise(resolve => {
            copy(sourcePath, targetPath, () => resolve());
        });
    })


    return Promise.all(promises);
}

export function copyPublicFiles(): Promise<void> {
    // TODO: read custom path from astro config
    const sourcePath = path.join(ORIG_DIR, 'public');
    const targetPath = path.join(CELESTIAL_TMP_SUBDIR, 'public');

    return new Promise(resolve => {
        copy(sourcePath, targetPath, () => resolve());
    });
}

export function generateLayoutMain(): Promise<void> {
    const template = layoutMainTemplate();
    const fileName = path.join(STYLEGUIDE_LAYOUT_DIR, 'LayoutMain.astro');

    return new Promise(resolve => {
        outputFile(fileName, template, () => resolve())
    });
}

export function generateAstroConfig(): Promise<void> {
    const config = getConfig();
    // TODO: auto-guess config extension / make name configurable
    const importPath = path.relative(STYLEGUIDE_DIR, path.join(ORIG_DIR, config.astroConfig || 'astro.config.mjs'));
    const outputFileName = path.join(STYLEGUIDE_DIR, 'astro.config.mjs');
    const template = `import { defineConfig } from 'astro/config';
import originalConfig from '${importPath}';

export default defineConfig({
    ...originalConfig,
    output: 'static',
    outDir: '../${config.outDir}',
    cacheDir: './.cache',
    server: { port: ${config.port} },
    devToolbar: { enabled: false }
});`

    return new Promise(resolve => {
        outputFile(outputFileName, template, () => resolve())
    });
}
