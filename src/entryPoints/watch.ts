import path from "path";
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import {getDocs, loadDocs} from "../helpers/getDocs.js";
import {writeAllStories, writeStory} from "../helpers/writeStories.js";
import {CELESTIAL_TMP_SUBDIR, ORIG_COMPONENT_GLOB, ORIG_GLOB} from "../helpers/constants.js";
import {execSync} from "child_process";
import {copyStaticFiles, generateAstroConfig} from "../helpers/setup.js";
import {writeMenu} from "../helpers/writeMenu.js";

export async function watch() {
    console.log('⚗️ Starting Astro …');

    console.log('⚗️ Generating styleguide base …');

    await copyStaticFiles();
    await generateAstroConfig();
    const allStories = await getDocs();
    await writeMenu(allStories);

    execSync(`astro dev --root ${CELESTIAL_TMP_SUBDIR}`,
        {stdio: 'inherit'}
    );

    console.log('⚗️ Generating styleguide stories …');

    await writeAllStories(allStories);

    console.log('💎 Finished generating styleguide');
    console.log('🏁 Watching for changes');

    // Initialize watcher.
    const watcher = chokidar.watch([ORIG_GLOB, ORIG_COMPONENT_GLOB], {
        persistent: true
    });

    const log = console.log.bind(console);

    watcher
        // .on('add', path => log(`File ${path} has been added`))
        .on('change', async path => {
            const changedDocs = await loadDocs(path);

            changedDocs.forEach((story) => {
                console.log('new story', story.content)
                writeStory(story);
            })
        })
        .on('unlink', path => log(`File ${path} has been removed`))
}
