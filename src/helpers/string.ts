import {CelestialDoc} from "../types.js";

const accents: Array<{ search: string; replace: string }> = [
    { search: 'ä', replace: 'ae' },
    { search: 'ö', replace: 'oe' },
    { search: 'ü', replace: 'ue' },
    { search: 'ã', replace: 'a' },
    { search: 'à', replace: 'a' },
    { search: 'á', replace: 'a' },
    { search: 'â', replace: 'a' },
    { search: 'ẽ', replace: 'e' },
    { search: 'è', replace: 'e' },
    { search: 'é', replace: 'e' },
    { search: 'ë', replace: 'e' },
    { search: 'ê', replace: 'e' },
    { search: 'ì', replace: 'i' },
    { search: 'í', replace: 'i' },
    { search: 'ï', replace: 'i' },
    { search: 'î', replace: 'i' },
    { search: 'õ', replace: 'o' },
    { search: 'ò', replace: 'o' },
    { search: 'ó', replace: 'o' },
    { search: 'ô', replace: 'o' },
    { search: 'ù', replace: 'u' },
    { search: 'ú', replace: 'u' },
    { search: 'û', replace: 'u' },
    { search: 'ñ', replace: 'n' },
    { search: 'ç', replace: 'c' }
];

export function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFC')
        .split('')
        .map((char) => {
            const accent = accents.find((a) => a.search === char);
            return accent?.replace || char;
        }) // Replace accents
        .join('')
        .trim()
        .replace(/\/+/g, '--') // Replace / with --
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim "-" from start of text
        .replace(/-+$/, ''); // Trim "-" from end of text
}

export function slugifyPath(path: string): string {
    return path.split('/').map(slugify).join('/')
}

export function getParamsForSubdoc(doc: CelestialDoc) {
    return Array.from(doc.subDocs).map(subDoc => `{ params: { slug: "${slugify(subDoc)}" } }`).join(',\n')
}
