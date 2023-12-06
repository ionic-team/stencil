import { MockDocument } from './document';
export type DOMParserSupportedType = 'text/html' | 'text/xml' | 'application/xml' | 'application/xhtml+xml' | 'image/svg+xml';
export declare class MockDOMParser {
    parseFromString(htmlToParse: string, mimeType: DOMParserSupportedType): MockDocument;
}
