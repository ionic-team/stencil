import { createElement } from './element';
import { MockComment } from './comment-node';
import { MockDocumentFragment } from './document-fragment';
import { MockDocumentTypeNode } from './document-type-node';
import { MockElement } from './node';
import { MockTextNode } from './text-node';
import { NODE_TYPES } from './constants';
import { parseDocumentUtil } from './parse-util';


export class MockDocument extends MockElement {
  defaultView: any;
  body: MockElement = null;
  documentElement: MockElement = null;
  head: MockElement = null;

  constructor(html: string = null, win: any = null) {
    super(null, null);
    this.nodeName = '#document';
    this.nodeType = NODE_TYPES.DOCUMENT_NODE;
    this.defaultView = win;

    this.appendChild(this.createDocumentTypeNode());

    if (typeof html === 'string') {
      const parsedDoc: MockDocument = parseDocumentUtil(this, html);

      this.documentElement = parsedDoc.children.find(elm => elm.nodeName === 'HTML');
      this.appendChild(this.documentElement);

      this.head = this.documentElement.children.find(elm => elm.nodeName === 'HEAD');
      this.body = this.documentElement.children.find(elm => elm.nodeName === 'BODY');
      setOwnerDocument(this.documentElement, this);

    } else if (html !== false) {
      this.documentElement = new MockElement(this, 'html');
      this.appendChild(this.documentElement);

      this.head = new MockElement(this, 'head');
      this.documentElement.appendChild(this.head);

      this.body = new MockElement(this, 'body');
      this.documentElement.appendChild(this.body);
    }
  }

  appendChild(newNode: MockElement) {
    newNode.remove();
    newNode.parentNode = this;
    this.childNodes.push(newNode);
    return newNode;
  }

  createComment(data: string) {
    return new MockComment(this, data);
  }

  createElement(tagName: string) {
    if (tagName === '#document') {
      const doc = new MockDocument(false as any);
      doc.nodeName = tagName;
      doc.parentNode = null;
      return doc;
    }

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
    getElementsByTagName(this, tagName.toLowerCase(), foundElms);
    return foundElms;
  }

  getElementsByName(name: string) {
    const foundElms: MockElement[] = [];
    getElementsByName(this, name.toLowerCase(), foundElms);
    return foundElms;
  }

  get title() {
    const title = this.head.querySelector('title');
    if (title != null) {
      return title.textContent;
    }
    return '';
  }
  set title(value: string) {
    let title = this.head.querySelector('title');
    if (title == null) {
      title = this.createElement('title');
      this.head.appendChild(title);
    }
    title.textContent = value;
  }

  $reset() {
    if (this.documentElement != null) {
      this.documentElement.childNodes.length = 0;
    }
    if (this.body != null) {
      this.body.childNodes.length = 0;
    }
    if (this.head != null) {
      this.head.childNodes.length = 0;
    }
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
    if (childElmFound != null) {
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
    if (childElm.nodeName.toLowerCase() === tagName) {
      foundElms.push(childElm);
    }
    getElementsByTagName(childElm, tagName, foundElms);
  }
}


function getElementsByName(elm: MockElement, name: string, foundElms: MockElement[]) {
  const children = elm.children;
  for (let i = 0; i < children.length; i++) {
    const childElm = children[i];
    if ((childElm as any).name && (childElm as any).name.toLowerCase() === name) {
      foundElms.push(childElm);
    }
    getElementsByName(childElm, name, foundElms);
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
