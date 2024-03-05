import path from "node:path";
import {getConfig} from "./config.js";

const config = getConfig();

export const WORKSPACE_ROOT = path.resolve(process.cwd());
export const CELESTIAL_TMP_SUBDIR = '.celestial';
export const CELESTIAL_DIR = path.join(WORKSPACE_ROOT, 'node_modules', 'celestial')
export const STYLEGUIDE_DIR = path.join(WORKSPACE_ROOT, CELESTIAL_TMP_SUBDIR)
export const STYLEGUIDE_SRC_DIR = path.join(STYLEGUIDE_DIR, 'src');
export const STYLEGUIDE_LAYOUT_DIR = path.join(STYLEGUIDE_SRC_DIR, 'layouts');
export const STYLEGUIDE_PAGE_DIR = path.join(STYLEGUIDE_SRC_DIR, 'pages', 'fragments');
export const ORIG_DIR = path.join(WORKSPACE_ROOT, config.srcDir || '');
export const ORIG_SRC_DIR = path.join(ORIG_DIR, 'src');
export const ORIG_COMPONENTS_DIR = path.join(ORIG_SRC_DIR, 'components');
export const ORIG_GLOB = `${ORIG_SRC_DIR}/**/*.docs.{js,ts}`;
export const ORIG_COMPONENT_GLOB = `${ORIG_SRC_DIR}/**/*.{astro,vue,svelte,jsx}`;
