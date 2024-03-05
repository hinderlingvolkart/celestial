import path from "node:path";
import { writeFile } from 'fs';
import { ensureDirSync } from 'fs-extra';
import type {CelestialStory} from "../types.ts";
import {generateMenu} from "./generateMenu.js";
import {STYLEGUIDE_SRC_DIR} from "./constants.js";

export function writeMenu(stories: CelestialStory[]): Promise<void> {
    return new Promise(resolve => {
        const targetPath = STYLEGUIDE_SRC_DIR;
        ensureDirSync(targetPath);
        const targetFile = path.join(targetPath, `menu.json`);

        const menu = generateMenu(stories);

        writeFile(targetFile, menu, (error) => {
            if (error) {
                console.warn('🚨 Could not write menu file', targetFile);
            } else {
                console.log('📚 Generated styleguide menu');
            }

            resolve();
        });
    })
}
