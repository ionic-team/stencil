import { MockNode } from './node';


export class MockComment extends MockNode {

  constructor(ownerDocument: any, data: string) {
    super(ownerDocument);
    this.nodeType = MockNode.COMMENT_NODE;
    this.nodeName = '#comment';
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
