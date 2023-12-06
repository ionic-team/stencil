import { getElementById } from './document';
import { MockHTMLElement } from './node';
export class MockDocumentFragment extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, null);
        this.nodeName = "#document-fragment" /* NODE_NAMES.DOCUMENT_FRAGMENT_NODE */;
        this.nodeType = 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */;
    }
    getElementById(id) {
        return getElementById(this, id);
    }
    cloneNode(deep) {
        const cloned = new MockDocumentFragment(null);
        if (deep) {
            for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
                const childNode = this.childNodes[i];
                if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
                    childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */ ||
                    childNode.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */) {
                    const clonedChildNode = this.childNodes[i].cloneNode(true);
                    cloned.appendChild(clonedChildNode);
                }
            }
        }
        return cloned;
    }
}
//# sourceMappingURL=document-fragment.js.map