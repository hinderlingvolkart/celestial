#!/usr/bin/env node
import {generate} from "./lib/cli/generate.js";
import {watch} from "./lib/cli/watch.js";

const [,, args] = process.argv;

if (args && (args.includes('--dev') || args.includes('-D'))) {
    await watch();
} else {
    await generate();
}

