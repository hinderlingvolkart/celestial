import path from "node:path";
import {copy, outputFile} from "fs-extra";
import {getConfig} from "./config.js";
import {CELESTIAL_DIR, STYLEGUIDE_DIR, STYLEGUIDE_SRC_DIR} from "./constants.js";

export function copyStaticFiles(): Promise<void> {
    const sourcePath = path.join(CELESTIAL_DIR, 'static');
    const targetPath = STYLEGUIDE_SRC_DIR;

    return new Promise(resolve => {
        copy(sourcePath, targetPath, () => resolve());
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
