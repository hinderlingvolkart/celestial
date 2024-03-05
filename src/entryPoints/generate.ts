import {getDocs} from "../helpers/getDocs.js";
import {writeAllStories} from "../helpers/writeStories.js";
import {writeMenu} from "../helpers/writeMenu.js";
import {copyStaticFiles, generateAstroConfig} from "../helpers/setup.js";
import {execSync} from "child_process";
import {CELESTIAL_TMP_SUBDIR} from "../helpers/constants.js";

export async function generate() {
    console.log('⚗️ Generating styleguide …');

    await copyStaticFiles();
    await generateAstroConfig();
    const allStories = await getDocs();
    await writeMenu(allStories);
    await writeAllStories(allStories);

    console.log('💎 Finished writing stories');

    execSync(`astro build --root ${CELESTIAL_TMP_SUBDIR}`,
        {stdio: 'inherit'}
    );

    console.log('💎 Finished generating styleguide');

    process.exit();
}
