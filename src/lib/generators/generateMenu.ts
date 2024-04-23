import type {CelestialDoc, CelestialMenuEntry} from "../../types.ts";
import {slugify} from "../../helpers/string.js";

function findEntry(entries: CelestialMenuEntry[], name: string): CelestialMenuEntry | undefined {
    return  entries.find(entry => entry.name === name);
}

export function generateMenu(docs: CelestialDoc[]): string {
    const allPaths = new Set<string>();
    const menu = docs.reduce<CelestialMenuEntry[]>((collection, doc) => {
        const { name, path, pathSlug, subDocs } = doc;
        let target = collection;

        path.split('/').filter(Boolean).forEach((folder, index) => {
            const currentEntry = findEntry(target, folder);

            if (currentEntry) {
                if (!currentEntry.children) {
                    currentEntry.children = [];
                }

                target = currentEntry.children;
            } else {
                const newEntry = {
                    name: folder,
                    path: pathSlug,
                    children: []
                };

                target.push(newEntry);
                target = newEntry.children;
            }
        })

        Array.from(subDocs).forEach(subDoc => {
            const subPath = `${pathSlug}/${slugify(subDoc)}`;
            allPaths.add(subPath);

            target.push({
                name: subDoc,
                path: subPath
            })
        })

        return collection;
    }, []);

    return JSON.stringify({ menu, allPaths: Array.from(allPaths) });
}
