#!/usr/bin/env node
import {generate} from "./index.js";
import {watch} from "./entryPoints/watch.js";

const [,, args] = process.argv;

if (args && (args.includes('--dev') || args.includes('-D'))) {
    await watch();
} else {
    await generate();
}

