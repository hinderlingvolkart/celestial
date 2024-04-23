export interface CelestialConfig {
    srcDir: string;
    outDir: string;
    port: number;
    logo: string;
    docHead: string;
    docFooter: string;
    navHead: string;
    navFooter: string;
}

export type CelestialPropType = Record<symbol, any>;

export interface CelestialProps {
    [key: string | symbol]: any;
}

export interface CelestialMenuEntry {
    name: string;
    path: string;
    children?: CelestialMenuEntry[];
}

export type CelestialFrameLayout = 'centered' | 'fullscreen'

export interface CelestialBase {
    layout: CelestialFrameLayout;
    template: string;
}

export type CelestialSubDocs = Set<string>;

export interface CelestialDoc {
    name: string, // Name only – e.g. Button
    path: string, // Base path – e.g. /components/base/Button
    slug: string, // Name in slug form – eg. contact-button
    pathSlug: string, // Base path in slug form – e.g. components/base-components/contact-button
    docPath: string // Full path to docs – e.g. /file/system/components/base/Button/ButtonDocs.astro,
    subDocs: CelestialSubDocs
}
