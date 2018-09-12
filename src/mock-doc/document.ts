import { createElement } from './element';
import { MockComment } from './comment-node';
import { MockDocumentFragment } from './document-fragment';
import { MockDocumentTypeNode } from './document-type-node';
import { MockElement } from './node';
import { MockTextNode } from './text-node';
import { NODE_TYPES } from './constants';
import { parseDocumentUtil } from './parse-util';


export class MockDocument extends MockElement {
  body: MockElement;
  defaultView: any;
  documentElement: MockElement;
  head: MockElement;
  _parser: any;

  constructor(html?: string) {
    super(null, null);
    this.nodeName = '#document';

    const docTypeNode = this.createDocumentTypeNode();
    this.appendChild(docTypeNode);

    if (typeof html === 'string') {
      const parsedDoc: MockDocument = parseDocumentUtil(this, html);

      this.documentElement = parsedDoc.children.find(elm => elm.nodeName === 'HTML');
      this.appendChild(this.documentElement);

      this.head = this.documentElement.children.find(elm => elm.nodeName === 'HEAD');
      this.body = this.documentElement.children.find(elm => elm.nodeName === 'BODY');
      setOwnerDocument(this.documentElement, this);

    } else {
      this.documentElement = new MockElement(this, 'html');
      this.appendChild(this.documentElement);

      this.head = new MockElement(this, 'head');
      this.documentElement.appendChild(this.head);

      this.body = new MockElement(this, 'body');
      this.documentElement.appendChild(this.body);
    }
  }

  createComment(data: string) {
    return new MockComment(this, data);
  }

  createElement(tagName: string) {
    return createElement(this, tagName);
  }

  createElementNS(namespaceURI: string, tagName: string) {
    const elmNs = new MockElement(this, tagName);
    elmNs.namespaceURI = namespaceURI;
    return elmNs;
  }

  createTextNode(text: string) {
    return new MockTextNode(this, text);
  }

  createDocumentFragment() {
    return new MockDocumentFragment(this);
  }

  createDocumentTypeNode() {
    return new MockDocumentTypeNode(this);
  }

  getElementById(id: string) {
    return getElementById(this, id);
  }

  getElementsByClassName(classNames: string) {
    const foundElms: MockElement[] = [];
    const classes = classNames.trim().split(' ').filter(c => c.length > 0);
    getElementsByClassName(this, classes, foundElms);
    return foundElms;
  }

  getElementsByTagName(tagName: string) {
    const foundElms: MockElement[] = [];
    getElementsByTagName(this, tagName, foundElms);
    return foundElms;
  }

  get title() {
    const title = this.head.querySelector('title');
    if (title) {
      return title.textContent;
    }
    return '';
  }
  set title(value) {
    let title = this.head.querySelector('title');
    if (!title) {
      title = this.createElement('title');
      this.head.appendChild(title);
    }
    title.textContent = value;
  }

}


function getElementById(elm: MockElement, id: string): MockElement {
  const children = elm.children;
  for (let i = 0; i < children.length; i++) {
    const childElm = children[i];
    if (childElm.id === id) {
      return childElm;
    }
    const childElmFound = getElementById(childElm, id);
    if (childElmFound) {
      return childElmFound;
    }
  }
  return null;
}


function getElementsByClassName(elm: MockElement, classNames: string[], foundElms: MockElement[]) {
  const children = elm.children;
  for (let i = 0; i < children.length; i++) {
    const childElm = children[i];
    for (let j = 0; j < classNames.length; j++) {
      if (childElm.classList.contains(classNames[j])) {
        foundElms.push(childElm);
      }
    }
    getElementsByClassName(childElm, classNames, foundElms);
  }
}


function getElementsByTagName(elm: MockElement, tagName: string, foundElms: MockElement[]) {
  const children = elm.children;
  for (let i = 0; i < children.length; i++) {
    const childElm = children[i];
    if (childElm.nodeName.toLowerCase() === tagName.toLowerCase()) {
      foundElms.push(childElm);
    }
    getElementsByTagName(childElm, tagName, foundElms);
  }
}


function setOwnerDocument(elm: MockElement, ownerDocument: any) {
  for (let i = 0; i < elm.childNodes.length; i++) {
    elm.childNodes[i].ownerDocument = ownerDocument;

    if (elm.childNodes[i].nodeType === NODE_TYPES.ELEMENT_NODE) {
      setOwnerDocument(elm.childNodes[i] as any, ownerDocument);
    }
  }
}
