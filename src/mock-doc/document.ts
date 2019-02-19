import { createElement } from './element';
import { MockComment } from './comment-node';
import { MockDocumentFragment } from './document-fragment';
import { MockDocumentTypeNode } from './document-type-node';
import { MockElement, MockTextNode, resetElement } from './node';
import { NODE_NAMES, NODE_TYPES } from './constants';
import { parseDocumentUtil } from './parse-util';
import { resetEventListeners } from './event';


export class MockDocument extends MockElement {
  defaultView: any;
  cookie: string;
  referrer: string;

  constructor(html: string | boolean = null, win: any = null) {
    super(null, null);
    this.nodeName = NODE_NAMES.DOCUMENT_NODE;
    this.nodeType = NODE_TYPES.DOCUMENT_NODE;
    this.defaultView = win;
    this.cookie = '';
    this.referrer = '';

    this.appendChild(this.createDocumentTypeNode());

    if (typeof html === 'string') {
      const parsedDoc: MockDocument = parseDocumentUtil(this, html);

      const documentElement = parsedDoc.children.find(elm => elm.nodeName === 'HTML');
      if (documentElement != null) {
        this.appendChild(documentElement);
        setOwnerDocument(documentElement, this);
      }

    } else if (html !== false) {
      const documentElement = new MockElement(this, 'html');
      this.appendChild(documentElement);

      documentElement.appendChild(new MockElement(this, 'head'));
      documentElement.appendChild(new MockElement(this, 'body'));
    }
  }

  get documentElement() {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeName === 'HTML') {
        return this.childNodes[i] as MockElement;
      }
    }

    const documentElement = new MockElement(this, 'html');
    this.appendChild(documentElement);
    return documentElement;
  }
  set documentElement(documentElement) {
    for (let i = this.childNodes.length - 1; i >= 0; i--) {
      if (this.childNodes[i].nodeType !== NODE_TYPES.DOCUMENT_TYPE_NODE) {
        this.childNodes[i].remove();
      }
    }
    this.appendChild(documentElement);
  }

  get head() {
    const documentElement = this.documentElement;
    for (let i = 0; i < documentElement.childNodes.length; i++) {
      if (documentElement.childNodes[i].nodeName === 'HEAD') {
        return documentElement.childNodes[i] as MockElement;
      }
    }

    const head = new MockElement(this, 'head');
    documentElement.insertBefore(head, documentElement.firstChild);
    return head;
  }

  get body() {
    const documentElement = this.documentElement;
    for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
      if (documentElement.childNodes[i].nodeName === 'BODY') {
        return documentElement.childNodes[i] as MockElement;
      }
    }

    const body = new MockElement(this, 'body');
    documentElement.appendChild(body);
    return body;
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
    if (tagName === NODE_NAMES.DOCUMENT_NODE) {
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

  getElementsByName(elmName: string) {
    const foundElms: MockElement[] = [];
    getElementsByName(this, elmName.toLowerCase(), foundElms);
    return foundElms;
  }

  get title() {
    const title = this.head.childNodes.find(elm => elm.nodeName === 'TITLE') as MockElement;
    if (title != null) {
      return title.textContent;
    }
    return '';
  }
  set title(value: string) {
    const head = this.head;
    let title = head.childNodes.find(elm => elm.nodeName === 'TITLE') as MockElement;
    if (title == null) {
      title = this.createElement('title');
      head.appendChild(title);
    }
    title.textContent = value;
  }

}


export function resetDocument(doc: Document) {
  if (doc != null) {
    try {
      doc.cookie = '';
      (doc as any).referrer = '';
    } catch (e) {}

    resetEventListeners(doc);

    const documentElement = doc.documentElement;
    if (documentElement != null) {
      resetElement(documentElement);

      for (let i = 0, ii = documentElement.childNodes.length; i < ii; i++) {
        const childNode = documentElement.childNodes[i];
        resetElement(childNode);
        childNode.childNodes.length = 0;
      }
    }
  }
}


function getElementById(elm: MockElement, id: string): MockElement {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
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
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    for (let j = 0, jj = classNames.length; j < jj; j++) {
      if (childElm.classList.contains(classNames[j])) {
        foundElms.push(childElm);
      }
    }
    getElementsByClassName(childElm, classNames, foundElms);
  }
}


function getElementsByTagName(elm: MockElement, tagName: string, foundElms: MockElement[]) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if (childElm.nodeName.toLowerCase() === tagName) {
      foundElms.push(childElm);
    }
    getElementsByTagName(childElm, tagName, foundElms);
  }
}


function getElementsByName(elm: MockElement, elmName: string, foundElms: MockElement[]) {
  const children = elm.children;
  for (let i = 0, ii = children.length; i < ii; i++) {
    const childElm = children[i];
    if ((childElm as any).name && (childElm as any).name.toLowerCase() === elmName) {
      foundElms.push(childElm);
    }
    getElementsByName(childElm, elmName, foundElms);
  }
}


export function setOwnerDocument(elm: MockElement, ownerDocument: any) {
  for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
    elm.childNodes[i].ownerDocument = ownerDocument;

    if (elm.childNodes[i].nodeType === NODE_TYPES.ELEMENT_NODE) {
      setOwnerDocument(elm.childNodes[i] as any, ownerDocument);
    }
  }
}
