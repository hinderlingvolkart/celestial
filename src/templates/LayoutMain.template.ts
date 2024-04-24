import path from "node:path";
import {existsSync} from "node:fs";
import {getConfig} from "../helpers/config.js";
import {STYLEGUIDE_LAYOUT_DIR, WORKSPACE_ROOT} from "../helpers/constants.js";

export function layoutMainTemplate() {
    const config = getConfig();

    const customHeadPath = path.join(WORKSPACE_ROOT, config.navHead || '');
    const relativeCustomHeadPath = path.relative(STYLEGUIDE_LAYOUT_DIR, customHeadPath);
    const hasCustomHead = config.navHead && existsSync(customHeadPath);

    return `---
import Sidebar from "../components/Sidebar.astro";
${ hasCustomHead ? 'import CustomHead from "' + relativeCustomHeadPath + '";' : 'const CustomHead = null;'};
import type { Props as SidebarProps } from "../components/Sidebar.astro";
interface Props {
    title: string;
    entries: SidebarProps["entries"];
    activePath: string;
}

const { title, entries, activePath } = Astro.props;
---

<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="description" content="Astro description" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="generator" content={Astro.generator} />
        <title>{title}</title>
    
      { CustomHead && <CustomHead /> }
    </head>
    <body>
        <div class="wrapper">
            <Sidebar entries={entries} activePath={activePath} />
            
            <div class="content">
                <slot />
            </div>
        </div>
    </body>
</html>

<style is:global>
:root {
    --docs-i-pad: var(--docs-pad, 16px);
    --docs-i-color-accent: var(--docs-color-accent, #4c06d0);
    --docs-i-color-text: var(--docs-color-text, #555);
    --docs-i-color-text-light: var(--docs-color-text-light, #999);
    --docs-i-color-grey-dark: var(--docs-color-text, #333);
    --docs-i-color-grey-lightest: var(--docs-color-grey-lightest, #f4f4f4);
}

* {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    box-sizing: border-box;
}

a {
    text-decoration: none;
}

button {
    appearance: none;
    background: none;
    border: none;
    text-align: left;
}

ul {
    list-style: none;
}
</style>
<style>
.wrapper {
    font-family: var(
    --docs-font-family,
    system-ui,
    -apple-system,
        BlinkMacSystemFont,
        "Open Sans",
        "Helvetica Neue",
    sans-serif
);
    position: fixed;
    inset: 0;
    display: flex;
    background: var(--docs-i-color-grey-lightest);
    color: var(--docs-i-color-text);
}

.content {
    width: calc(100% - var(--docs-i-pad));
    height: calc(100% - 2 * var(--docs-i-pad) - 15px);
    margin-top: calc(20px + var(--docs-i-pad));
    margin-right: var(--docs-i-pad);
    background: var(--docs-bg-inner, var(--docs-i-color-grey-dark));
    box-shadow: var(--docs-shadow-inner, 0px 0px 6px 2px rgba(0, 0, 0, 0.05));
    border-radius: var(--docs-radius-inner, 6px);
}
</style>`;
}
