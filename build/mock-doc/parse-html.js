import { MockDocument } from './document';
import { parseDocumentUtil, parseFragmentUtil } from './parse-util';
let sharedDocument;
export function parseHtmlToDocument(html, ownerDocument = null) {
    if (ownerDocument == null) {
        if (sharedDocument == null) {
            sharedDocument = new MockDocument();
        }
        ownerDocument = sharedDocument;
    }
    return parseDocumentUtil(ownerDocument, html);
}
export function parseHtmlToFragment(html, ownerDocument = null) {
    if (ownerDocument == null) {
        if (sharedDocument == null) {
            sharedDocument = new MockDocument();
        }
        ownerDocument = sharedDocument;
    }
    return parseFragmentUtil(ownerDocument, html);
}
//# sourceMappingURL=parse-html.js.map