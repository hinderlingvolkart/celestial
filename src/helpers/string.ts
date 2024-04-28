import {CelestialDoc} from "../types.js";

const accents: Record<string, string> = {
	ä: "ae",
	ö: "oe",
	ü: "ue",
	ã: "a",
	à: "a",
	á: "a",
	â: "a",
	ẽ: "e",
	è: "e",
	é: "e",
	ë: "e",
	ê: "e",
	ì: "i",
	í: "i",
	ï: "i",
	î: "i",
	õ: "o",
	ò: "o",
	ó: "o",
	ô: "o",
	ù: "u",
	ú: "u",
	û: "u",
	ñ: "m",
	ç: "c",
};

export function slugify(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFC')
        .split('')
        .map((c: string) => accents[c] || c)
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
