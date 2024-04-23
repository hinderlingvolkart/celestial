import {getDocs} from "../../helpers/getDocs.js";
import {writeMenu} from "../../helpers/writeMenu.js";
import {emptyDirSync} from "fs-extra";
import {CELESTIAL_TMP_SUBDIR} from "../../helpers/constants.js";
import {copyPublicFiles, copyStaticFiles, generateAstroConfig, generateLayoutMain} from "../../helpers/setup.js";
import {execSync} from "child_process";
import {writeAllDocs} from "../../helpers/writeStories.js";

export async function generate() {
    console.log('⚗️ Generating styleguide …');

    emptyDirSync(CELESTIAL_TMP_SUBDIR);
    await copyStaticFiles();
    await copyPublicFiles();
    await generateLayoutMain();
    await generateAstroConfig();
    const allDocs = await getDocs();

    await writeMenu(allDocs);
    await writeAllDocs(allDocs);

    console.log('💎 Finished writing stories');

    execSync(`astro build --root ${CELESTIAL_TMP_SUBDIR}`,
        {stdio: 'inherit'}
    );

    console.log('💎 Finished generating styleguide');

    process.exit();
}
