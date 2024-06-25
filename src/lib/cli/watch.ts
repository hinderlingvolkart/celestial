import {emptyDirSync} from "fs-extra";
import chokidar from 'chokidar';
import {CELESTIAL_TMP_SUBDIR, ORIG_COMPONENT_GLOB, ORIG_GLOB} from "../../helpers/constants.js";
import {
    copyAdditionalFilesAndFolders,
    copyPublicFiles,
    copyStaticFiles,
    generateAstroConfig,
    generateLayoutMain
} from "../../helpers/setup.js";
import {getDocs, loadDocs} from "../../helpers/getDocs.js";
import {writeMenu} from "../../helpers/writeMenu.js";
import {writeAllDocs, writeDoc} from "../../helpers/writeStories.js";
import {execSync} from "child_process";

export async function watch() {
    console.log('⚗️ Starting Astro …');

    console.log('⚗️ Generating styleguide base …');

    emptyDirSync(CELESTIAL_TMP_SUBDIR);
    await copyStaticFiles();
    await copyPublicFiles();
    await copyAdditionalFilesAndFolders();
    await generateLayoutMain();
    await generateAstroConfig();
    const allDocs = await getDocs();

    await writeMenu(allDocs);

    console.log('⚗️ Generating styleguide stories …');

    await writeAllDocs(allDocs);

    execSync(`astro dev --root ${CELESTIAL_TMP_SUBDIR}`,
        {stdio: 'inherit'}
    );

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
                writeDoc(story);
            })
        })
        .on('unlink', async path => {
            await writeMenu(allDocs);
            log(`File ${path} has been removed`)
        })
}
