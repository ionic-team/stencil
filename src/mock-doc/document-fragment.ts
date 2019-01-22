import { MockElement } from './node';
import { NODE_NAMES, NODE_TYPES } from './constants';


export class MockDocumentFragment extends MockElement {

  constructor(ownerDocument: any) {
    super(ownerDocument, null);
    this.nodeName = NODE_NAMES.DOCUMENT_FRAGMENT_NODE;
    this.nodeType = NODE_TYPES.DOCUMENT_FRAGMENT_NODE;
  }

  cloneNode(deep?: boolean) {
    const cloned = new MockDocumentFragment(null);

    if (deep) {
      for (let i = 0; i < this.childNodes.length; i++) {
        const childNode = this.childNodes[i];
        if (childNode.nodeType === NODE_TYPES.ELEMENT_NODE || childNode.nodeType === NODE_TYPES.TEXT_NODE || childNode.nodeType === NODE_TYPES.COMMENT_NODE) {
          const clonedChildNode = this.childNodes[i].cloneNode(true);
          cloned.appendChild(clonedChildNode);
        }
      }
    }

    return cloned;
  }

}
