import type {CelestialMenuEntry, CelestialStory} from "../types.ts";

function findEntry(entries: CelestialMenuEntry[], name: string): CelestialMenuEntry | undefined {
    return  entries.find(entry => entry.name === name);
}

export function generateMenu(stories: CelestialStory[]): string {
    const allPaths = new Set<string>();
    const menu = stories.reduce<CelestialMenuEntry[]>((collection, story) => {
        const storyName = story.name;
        const { docsDirectory } = story.config;
        let target = collection;

        docsDirectory.split('/').filter(Boolean).forEach(folder => {
            const currentEntry = findEntry(target, folder);

            if (currentEntry) {
                if (!currentEntry.children) {
                    currentEntry.children = [];
                }

                target = currentEntry.children;
            } else {
                const newEntry = {
                    name: folder,
                    path: `${docsDirectory}/${storyName}`.toLowerCase(),
                    children: []
                };

                target.push(newEntry);
                target = newEntry.children;
                allPaths.add(newEntry.path);
            }
        })

        const storyPath = `${docsDirectory}/${storyName}`.toLowerCase();
        target.push({
            name: storyName,
            path: storyPath
        });

        allPaths.add(storyPath);

        return collection;
    }, []);

    return JSON.stringify({ menu, allPaths: Array.from(allPaths) });
}
