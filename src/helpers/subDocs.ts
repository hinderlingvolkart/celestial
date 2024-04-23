import {getAsDom} from "./parseAstro.js";

export function getSubDocsFromDocsFile(content: string): Set<string> {
    const dom = getAsDom(content);
    const titles: Set<string> = new Set();

    Array.from(dom.querySelectorAll('Docs')).forEach(el => {
        const title = el.getAttribute('title') || '';

        if (titles.has(title)) {
            throw new Error(`Duplicate title attribute – every Doc should have a unique title – ${title}`);
        }

        titles.add(title);
    });

    return titles;
}

