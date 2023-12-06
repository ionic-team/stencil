import { parseHtmlToDocument } from './parse-html';
export class MockDOMParser {
    parseFromString(htmlToParse, mimeType) {
        if (mimeType !== 'text/html') {
            console.error('XML parsing not implemented yet, continuing as html');
        }
        return parseHtmlToDocument(htmlToParse);
    }
}
//# sourceMappingURL=parser.js.map