import { MockNode } from './node';
export class MockComment extends MockNode {
    constructor(ownerDocument, data) {
        super(ownerDocument, 8 /* NODE_TYPES.COMMENT_NODE */, "#comment" /* NODE_NAMES.COMMENT_NODE */, data);
    }
    cloneNode(_deep) {
        return new MockComment(null, this.nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    set textContent(text) {
        this.nodeValue = text;
    }
}
//# sourceMappingURL=comment-node.js.map