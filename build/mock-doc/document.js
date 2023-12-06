import { MockAttr } from './attribute';
import { MockComment } from './comment-node';
import { MockDocumentFragment } from './document-fragment';
import { MockDocumentTypeNode } from './document-type-node';
import { createElement, createElementNS } from './element';
import { resetEventListeners } from './event';
import { MockHTMLElement, MockTextNode, resetElement } from './node';
import { parseHtmlToFragment } from './parse-html';
import { parseDocumentUtil } from './parse-util';
import { MockWindow } from './window';
export class MockDocument extends MockHTMLElement {
    constructor(html = null, win = null) {
        super(null, null);
        this.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
        this.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
        this.defaultView = win;
        this.cookie = '';
        this.referrer = '';
        this.appendChild(this.createDocumentTypeNode());
        if (typeof html === 'string') {
            const parsedDoc = parseDocumentUtil(this, html);
            const documentElement = parsedDoc.children.find((elm) => elm.nodeName === 'HTML');
            if (documentElement != null) {
                this.appendChild(documentElement);
                setOwnerDocument(documentElement, this);
            }
        }
        else if (html !== false) {
            const documentElement = new MockHTMLElement(this, 'html');
            this.appendChild(documentElement);
            documentElement.appendChild(new MockHTMLElement(this, 'head'));
            documentElement.appendChild(new MockHTMLElement(this, 'body'));
        }
    }
    get dir() {
        return this.documentElement.dir;
    }
    set dir(value) {
        this.documentElement.dir = value;
    }
    get location() {
        if (this.defaultView != null) {
            return this.defaultView.location;
        }
        return null;
    }
    set location(val) {
        if (this.defaultView != null) {
            this.defaultView.location = val;
        }
    }
    get baseURI() {
        const baseNode = this.head.childNodes.find((node) => node.nodeName === 'BASE');
        if (baseNode) {
            return baseNode.href;
        }
        return this.URL;
    }
    get URL() {
        return this.location.href;
    }
    get styleSheets() {
        return this.querySelectorAll('style');
    }
    get scripts() {
        return this.querySelectorAll('script');
    }
    get forms() {
        return this.querySelectorAll('form');
    }
    get images() {
        return this.querySelectorAll('img');
    }
    get scrollingElement() {
        return this.documentElement;
    }
    get documentElement() {
        for (let i = this.childNodes.length - 1; i >= 0; i--) {
            if (this.childNodes[i].nodeName === 'HTML') {
                return this.childNodes[i];
            }
        }
        const documentElement = new MockHTMLElement(this, 'html');
        this.appendChild(documentElement);
        return documentElement;
    }
    set documentElement(documentElement) {
        for (let i = this.childNodes.length - 1; i >= 0; i--) {
            if (this.childNodes[i].nodeType !== 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */) {
                this.childNodes[i].remove();
            }
        }
        if (documentElement != null) {
            this.appendChild(documentElement);
            setOwnerDocument(documentElement, this);
        }
    }
    get head() {
        const documentElement = this.documentElement;
        for (let i = 0; i < documentElement.childNodes.length; i++) {
            if (documentElement.childNodes[i].nodeName === 'HEAD') {
                return documentElement.childNodes[i];
            }
        }
        const head = new MockHTMLElement(this, 'head');
        documentElement.insertBefore(head, documentElement.firstChild);
        return head;
    }
    set head(head) {
        const documentElement = this.documentElement;
        for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
            if (documentElement.childNodes[i].nodeName === 'HEAD') {
                documentElement.childNodes[i].remove();
            }
        }
        if (head != null) {
            documentElement.insertBefore(head, documentElement.firstChild);
            setOwnerDocument(head, this);
        }
    }
    get body() {
        const documentElement = this.documentElement;
        for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
            if (documentElement.childNodes[i].nodeName === 'BODY') {
                return documentElement.childNodes[i];
            }
        }
        const body = new MockHTMLElement(this, 'body');
        documentElement.appendChild(body);
        return body;
    }
    set body(body) {
        const documentElement = this.documentElement;
        for (let i = documentElement.childNodes.length - 1; i >= 0; i--) {
            if (documentElement.childNodes[i].nodeName === 'BODY') {
                documentElement.childNodes[i].remove();
            }
        }
        if (body != null) {
            documentElement.appendChild(body);
            setOwnerDocument(body, this);
        }
    }
    appendChild(newNode) {
        newNode.remove();
        newNode.parentNode = this;
        this.childNodes.push(newNode);
        return newNode;
    }
    createComment(data) {
        return new MockComment(this, data);
    }
    createAttribute(attrName) {
        return new MockAttr(attrName.toLowerCase(), '');
    }
    createAttributeNS(namespaceURI, attrName) {
        return new MockAttr(attrName, '', namespaceURI);
    }
    createElement(tagName) {
        if (tagName === "#document" /* NODE_NAMES.DOCUMENT_NODE */) {
            const doc = new MockDocument(false);
            doc.nodeName = tagName;
            doc.parentNode = null;
            return doc;
        }
        return createElement(this, tagName);
    }
    createElementNS(namespaceURI, tagName) {
        const elmNs = createElementNS(this, namespaceURI, tagName);
        return elmNs;
    }
    createTextNode(text) {
        return new MockTextNode(this, text);
    }
    createDocumentFragment() {
        return new MockDocumentFragment(this);
    }
    createDocumentTypeNode() {
        return new MockDocumentTypeNode(this);
    }
    getElementById(id) {
        return getElementById(this, id);
    }
    getElementsByName(elmName) {
        return getElementsByName(this, elmName.toLowerCase());
    }
    get title() {
        const title = this.head.childNodes.find((elm) => elm.nodeName === 'TITLE');
        if (title != null && typeof title.textContent === 'string') {
            return title.textContent.trim();
        }
        return '';
    }
    set title(value) {
        const head = this.head;
        let title = head.childNodes.find((elm) => elm.nodeName === 'TITLE');
        if (title == null) {
            title = this.createElement('title');
            head.appendChild(title);
        }
        title.textContent = value;
    }
}
export function createDocument(html = null) {
    return new MockWindow(html).document;
}
export function createFragment(html) {
    return parseHtmlToFragment(html, null);
}
export function resetDocument(doc) {
    if (doc != null) {
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
        for (const key in doc) {
            if (doc.hasOwnProperty(key) && !DOC_KEY_KEEPERS.has(key)) {
                delete doc[key];
            }
        }
        try {
            doc.nodeName = "#document" /* NODE_NAMES.DOCUMENT_NODE */;
        }
        catch (e) { }
        try {
            doc.nodeType = 9 /* NODE_TYPES.DOCUMENT_NODE */;
        }
        catch (e) { }
        try {
            doc.cookie = '';
        }
        catch (e) { }
        try {
            doc.referrer = '';
        }
        catch (e) { }
    }
}
const DOC_KEY_KEEPERS = new Set([
    'nodeName',
    'nodeType',
    'nodeValue',
    'ownerDocument',
    'parentNode',
    'childNodes',
    '_shadowRoot',
]);
export function getElementById(elm, id) {
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
function getElementsByName(elm, elmName, foundElms = []) {
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        if (childElm.name && childElm.name.toLowerCase() === elmName) {
            foundElms.push(childElm);
        }
        getElementsByName(childElm, elmName, foundElms);
    }
    return foundElms;
}
export function setOwnerDocument(elm, ownerDocument) {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
        elm.childNodes[i].ownerDocument = ownerDocument;
        if (elm.childNodes[i].nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
            setOwnerDocument(elm.childNodes[i], ownerDocument);
        }
    }
}
//# sourceMappingURL=document.js.map