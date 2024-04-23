import path from "node:path";
import type {CelestialDoc} from "../../types.ts";
import {STYLEGUIDE_LAYOUT_DIR, WORKSPACE_ROOT} from "../../helpers/constants.js";
import {getParamsForSubdoc} from "../../helpers/string.js";
import {existsSync} from "node:fs";
import {getConfig} from "../../helpers/config.js";

export function generateDocsPage(targetPath: string, doc: CelestialDoc): string {
    const config = getConfig();

    const layoutPath = path.join(STYLEGUIDE_LAYOUT_DIR, `LayoutInner.astro`);
    const customHeadPath = path.join(WORKSPACE_ROOT, config.docHead || '');
    const customFooterPath = path.join(WORKSPACE_ROOT, config.docFooter || '');
    const relativeLayoutPath = path.relative(targetPath, layoutPath);
    const relativeStoryPath = path.relative(targetPath, doc.docPath);
    const relativeCustomHeadPath = path.relative(targetPath, customHeadPath);
    const relativeCustomFooterPath = path.relative(targetPath, customFooterPath);

    const hasCustomHead = config.docHead && existsSync(customHeadPath);
    const hasCustomFooter = config.docFooter && existsSync(customFooterPath);

    return `---
import type { GetStaticPaths } from "astro";
import Layout from "${relativeLayoutPath}";
import Page from "${relativeStoryPath}";
${ hasCustomHead ? 'import CustomHead from "' + relativeCustomHeadPath + '";' : 'const CustomHead = null;'};
${ hasCustomFooter ? 'import CustomFooter from "' + relativeCustomFooterPath + '";' : 'const CustomFooter = null;'};

export const getStaticPaths = (() => {
  return [
    ${getParamsForSubdoc(doc)}
  ];
}) satisfies GetStaticPaths;
---
<Layout title="${doc.name}">
  <Page />

  { CustomHead && <Fragment slot="head">
    <CustomHead />
  </Fragment> }

  { CustomFooter && <Fragment slot="footer">
    <CustomFooter />
  </Fragment> }
</Layout>`;}
