import { MockNode } from './node';
import { NODE_NAMES, NODE_TYPES } from './constants';


export class MockTextNode extends MockNode {

  constructor(ownerDocument: any, text: string) {
    super(ownerDocument);
    this.nodeType = NODE_TYPES.TEXT_NODE;
    this.nodeName = NODE_NAMES.TEXT_NODE;
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
        if (childNode.nodeType === NODE_TYPES.TEXT_NODE) {
          text.push(childNode.nodeValue);
        }
      }
      return text.join('');
    }

    return this.nodeValue;
  }

}
