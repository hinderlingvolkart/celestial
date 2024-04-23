import path from "node:path";
import {copy, outputFile} from "fs-extra";
import {getConfig} from "./config.js";
import {
    CELESTIAL_DIR,
    CELESTIAL_TMP_SUBDIR,
    ORIG_DIR,
    STYLEGUIDE_DIR,
    STYLEGUIDE_LAYOUT_DIR,
    STYLEGUIDE_SRC_DIR
} from "./constants.js";
import {layoutMainTemplate} from "../templates/LayoutMain.template.js";

export function copyStaticFiles(): Promise<void> {
    const sourcePath = path.join(CELESTIAL_DIR, 'static');
    const targetPath = STYLEGUIDE_SRC_DIR;

    return new Promise(resolve => {
        copy(sourcePath, targetPath, () => resolve());
    });
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
    const fileName = path.join(STYLEGUIDE_DIR, 'astro.config.mjs');
    const template = `import { defineConfig } from 'astro/config';

export default defineConfig({
    output: 'static',
    outDir: '../${config.outDir}',
    cacheDir: './.cache',
    server: { port: ${config.port} },
    devToolbar: { enabled: false }
});`

    return new Promise(resolve => {
        outputFile(fileName, template, () => resolve())
    });
}
