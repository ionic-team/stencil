import { MockNode } from './node';
import { NODE_NAMES, NODE_TYPES } from './constants';

export class MockComment extends MockNode {
  constructor(ownerDocument: any, data: string) {
    super(ownerDocument, NODE_TYPES.COMMENT_NODE, NODE_NAMES.COMMENT_NODE, data);
  }

  cloneNode(_deep?: boolean) {
    return new MockComment(null, this.nodeValue);
  }

  get textContent() {
    return this.nodeValue;
  }

  set textContent(text) {
    this.nodeValue = text;
  }
}
