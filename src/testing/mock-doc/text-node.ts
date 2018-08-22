import { MockNode } from './node';


export class MockTextNode extends MockNode {

  constructor(ownerDocument: any, text: string) {
    super(ownerDocument);
    this.nodeType = MockNode.TEXT_NODE;
    this.nodeName = '#text';
    this.nodeValue = text;
  }

  cloneNode(deep?: boolean) {
    const cloned = new MockTextNode(null, this.nodeValue);

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

  get wholeText() {
    if (this.parentNode) {
      const text: string[] = [];
      for (let i = 0; i < this.parentNode.childNodes.length; i++) {
        const childNode = this.parentNode.childNodes[i];
        if (childNode.nodeType === MockNode.TEXT_NODE) {
          text.push(childNode.nodeValue);
        }
      }
      return text.join('');
    }

    return this.nodeValue;
  }

}
