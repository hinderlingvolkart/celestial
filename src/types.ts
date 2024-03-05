export interface CelestialConfig {
    srcDir: string;
    outDir: string;
    port: number;
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

export interface Celestial extends CelestialProps {
    _celestialBase: CelestialBase;
}

export interface CelestialStoryConfig {
    layout: CelestialFrameLayout,
    template: string,
    componentName: string,
    componentPath: string,
    docsPath: string,
    docsDirectory: string,
    props: CelestialProps
}

export interface CelestialStory {
    name: string;
    config: CelestialStoryConfig;
    content: string;
}
