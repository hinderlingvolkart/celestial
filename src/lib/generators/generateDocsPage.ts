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
import { Code } from 'astro:components';
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
  <Code class="code" code=\`${doc.code}\` lang="js" theme="aurora-x" wrap />

  { CustomHead && <Fragment slot="head">
    <CustomHead />
  </Fragment> }

  { CustomFooter && <Fragment slot="footer">
    <CustomFooter />
  </Fragment> }
</Layout>

<style>
.code {
  display: none;
  position: fixed;
  inset: 0;
  margin: 0;
  font-size: 15px;
  padding: 1.5em;
  overflow-y: auto;
}

:global([data-celestial-view="code"]) .code {
    display: block;
}
</style>

<script>
window.addEventListener('message', (event) => {
    switch (event.data) {
        case 'celestial:view:code':
            document.documentElement.setAttribute('data-celestial-view', 'code')
            break;
        case 'celestial:view:component':
            document.documentElement.setAttribute('data-celestial-view', 'component')
            break;
        default:
            break;
    }
})
</script>`;}
