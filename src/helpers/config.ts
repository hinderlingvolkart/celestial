import path from "node:path";
import fs from "node:fs";
import {WORKSPACE_ROOT} from "./constants.js";
import {CelestialConfig} from "../types.js";

export const CONFIG_NAME = 'celestial.config.json';

export function getConfig(): CelestialConfig {
    try {
        const configFile = fs.readFileSync(path.join(path.resolve(process.cwd()), CONFIG_NAME), { encoding: 'utf-8'});
        const config = JSON.parse(configFile);
        return config && config as CelestialConfig;
    } catch(_err) {
        console.error('Celestial config not found. Create a celestial.config.js file in your project root.');
        process.exit(1);
    }
}
