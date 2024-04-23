import { parseHTML } from 'linkedom';

export function getTemplate(content: string): string {
    return content.split('---').at(-1);
};

export function getAsDom(content: string): Document {
    return parseHTML(getTemplate(content)).document;
}
