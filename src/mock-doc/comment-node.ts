import { MockNode } from './node';
import { NODE_NAMES, NODE_TYPES } from './constants';


export class MockComment extends MockNode {

  constructor(ownerDocument: any, data: string) {
    super(ownerDocument);
    this.nodeType = NODE_TYPES.COMMENT_NODE;
    this.nodeName = NODE_NAMES.COMMENT_NODE;
    this.nodeValue = data;
  }

  cloneNode(deep?: boolean) {
    const cloned = new MockComment(null, this.nodeValue);

    if (deep) {
      for (let i = 0; i < this.childNodes.length; i++) {
        const clonedChildNode = this.childNodes[i].cloneNode(true);
        cloned.appendChild(clonedChildNode);
      }
    }

    return cloned;
  }

  get textContent() {
    return this.nodeValue;
  }

  set textContent(text) {
    this.nodeValue = text;
  }

}
