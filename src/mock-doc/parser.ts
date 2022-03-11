import { MockDocument } from './document';
import { parseHtmlToDocument } from './parse-html';

export type DOMParserSupportedType =
    "text/html" |
    "text/xml" |
    "application/xml" |
    "application/xhtml+xml" |
    "image/svg+xml";

export default class MockDOMParser {
    parseFromString(string: string, type: DOMParserSupportedType): MockDocument {
        if (type !== 'text/html') console.error('XML parsing not implemented yet, continuing as html');
        return parseHtmlToDocument(string);
    }
}

export { MockDOMParser };
