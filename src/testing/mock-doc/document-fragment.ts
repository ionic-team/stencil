import { MockElement, MockNode } from './node';


export class MockDocumentFragment extends MockElement {

  constructor(ownerDocument: any) {
    super(ownerDocument, null);
    this.nodeName = '#document-fragment';
    this.nodeType = MockNode.DOCUMENT_FRAGMENT_NODE;
  }

  cloneNode(deep?: boolean) {
    const cloned = new MockDocumentFragment(null);

    if (deep) {
      for (let i = 0; i < this.childNodes.length; i++) {
        const childNode = this.childNodes[i];
        if (childNode.nodeType === MockNode.ELEMENT_NODE || childNode.nodeType === MockNode.TEXT_NODE || childNode.nodeType === MockNode.COMMENT_NODE) {
          const clonedChildNode = this.childNodes[i].cloneNode(true);
          cloned.appendChild(clonedChildNode);
        }
      }
    }

    return cloned;
  }

}
