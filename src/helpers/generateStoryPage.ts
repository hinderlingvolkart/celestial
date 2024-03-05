import path from "node:path";
import type {CelestialStoryConfig} from "../types.ts";
import {STYLEGUIDE_LAYOUT_DIR} from "./constants.js";

function parseTemplate(template: string, props: object) {
    let parsedTemplate = template;

    for (const [key, value] of Object.entries(props)) {
        parsedTemplate = parsedTemplate.replace(`{${key}}`, `"${value}"`);
    }

    return parsedTemplate;
}

export function generateStoryPage(config: CelestialStoryConfig): string {
    const layoutName = config.layout === 'centered'
        ? 'LayoutInnerCentered'
        : 'LayoutInnerFull';
    const layoutPath = path.join(STYLEGUIDE_LAYOUT_DIR, `${layoutName}.astro`)
    const relativeLayoutPath = path.relative(config.docsPath, layoutPath);
    const relativeComponentPath = path.relative(config.docsPath, config.componentPath);

    const frontMatter =
        `---
import ${layoutName} from '${relativeLayoutPath}';
import ${config.componentName} from '${relativeComponentPath}';
---`;

    const template = config.props && typeof config.props === 'object'
        ? parseTemplate(config.template, config.props)
        : config.template;

    return `${frontMatter}

<${layoutName} title="${config.componentName}">
${template}
</${layoutName}>`;
}
