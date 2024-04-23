import path from "node:path";
import type {CelestialDoc} from "../../types.ts";
import {STYLEGUIDE_LAYOUT_DIR} from "../../helpers/constants.js";
import {getParamsForSubdoc} from "../../helpers/string.js";

export function generateDocsPage(targetPath: string, doc: CelestialDoc): string {
    const layoutPath = path.join(STYLEGUIDE_LAYOUT_DIR, `LayoutInner.astro`)
    const relativeLayoutPath = path.relative(targetPath, layoutPath);
    const relativeStoryPath = path.relative(targetPath, doc.docPath);

    return `---
import type { GetStaticPaths } from "astro";
import Layout from "${relativeLayoutPath}";
import Page from "${relativeStoryPath}";

export const getStaticPaths = (() => {
  return [
    ${getParamsForSubdoc(doc)}
  ];
}) satisfies GetStaticPaths;
---
<Layout title="${doc.name}">
 <Page />
</Layout>`;}
