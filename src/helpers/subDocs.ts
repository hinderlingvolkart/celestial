import {slugify} from "./string.js";

export function getSubDocs(document: Document): Set<string> {
    const titles: Set<string> = new Set();

    Array.from(document.querySelectorAll('Docs')).forEach(el => {
        const title = el.getAttribute('title') || '';

        if (!title) {
            throw new Error(`Missing title attribute – every Doc must have a title`);
        }

        if (titles.has(title)) {
            throw new Error(`Duplicate title attribute – every Doc should have a unique title – ${title}`);
        }

        titles.add(title);
    });

    return titles;
}

export function getCode(document: Document): string {
    let stringEncoded = '{';

    Array.from(document.querySelectorAll('Docs')).forEach(el => {
        const title = slugify(el.getAttribute('title') || '');
        stringEncoded += `"${title}":\``;
        stringEncoded += el.innerHTML.trim();
        stringEncoded += `\`,`
    });

    return stringEncoded + '}';
}
