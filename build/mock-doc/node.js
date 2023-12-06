import { createAttributeProxy, MockAttr } from './attribute';
import { MockClassList } from './class-list';
import { createCSSStyleDeclaration } from './css-style-declaration';
import { attributeChanged, checkAttributeChanged, connectNode, disconnectNode } from './custom-element-registry';
import { dataset } from './dataset';
import { addEventListener, dispatchEvent, MockEvent, MockFocusEvent, removeEventListener, resetEventListeners, } from './event';
import { parseFragmentUtil } from './parse-util';
import { matches, selectAll, selectOne } from './selector';
import { NON_ESCAPABLE_CONTENT, serializeNodeToHtml } from './serialize-node';
export class MockNode {
    constructor(ownerDocument, nodeType, nodeName, nodeValue) {
        this.ownerDocument = ownerDocument;
        this.nodeType = nodeType;
        this.nodeName = nodeName;
        this._nodeValue = nodeValue;
        this.parentNode = null;
        this.childNodes = [];
    }
    appendChild(newNode) {
        if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
            const nodes = newNode.childNodes.slice();
            for (const child of nodes) {
                this.appendChild(child);
            }
        }
        else {
            newNode.remove();
            newNode.parentNode = this;
            this.childNodes.push(newNode);
            connectNode(this.ownerDocument, newNode);
        }
        return newNode;
    }
    append(...items) {
        items.forEach((item) => {
            const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
            this.appendChild(isNode ? item : this.ownerDocument.createTextNode(String(item)));
        });
    }
    prepend(...items) {
        const firstChild = this.firstChild;
        items.forEach((item) => {
            const isNode = typeof item === 'object' && item !== null && 'nodeType' in item;
            if (firstChild) {
                this.insertBefore(isNode ? item : this.ownerDocument.createTextNode(String(item)), firstChild);
            }
        });
    }
    cloneNode(deep) {
        throw new Error(`invalid node type to clone: ${this.nodeType}, deep: ${deep}`);
    }
    compareDocumentPosition(_other) {
        // unimplemented
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
        return -1;
    }
    get firstChild() {
        return this.childNodes[0] || null;
    }
    insertBefore(newNode, referenceNode) {
        if (newNode.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
            for (let i = 0, ii = newNode.childNodes.length; i < ii; i++) {
                insertBefore(this, newNode.childNodes[i], referenceNode);
            }
        }
        else {
            insertBefore(this, newNode, referenceNode);
        }
        return newNode;
    }
    get isConnected() {
        let node = this;
        while (node != null) {
            if (node.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */) {
                return true;
            }
            node = node.parentNode;
            if (node != null && node.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */) {
                node = node.host;
            }
        }
        return false;
    }
    isSameNode(node) {
        return this === node;
    }
    get lastChild() {
        return this.childNodes[this.childNodes.length - 1] || null;
    }
    get nextSibling() {
        if (this.parentNode != null) {
            const index = this.parentNode.childNodes.indexOf(this) + 1;
            return this.parentNode.childNodes[index] || null;
        }
        return null;
    }
    get nodeValue() {
        var _a;
        return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
    }
    set nodeValue(value) {
        this._nodeValue = value;
    }
    get parentElement() {
        return this.parentNode || null;
    }
    set parentElement(value) {
        this.parentNode = value;
    }
    get previousSibling() {
        if (this.parentNode != null) {
            const index = this.parentNode.childNodes.indexOf(this) - 1;
            return this.parentNode.childNodes[index] || null;
        }
        return null;
    }
    contains(otherNode) {
        if (otherNode === this) {
            return true;
        }
        const childNodes = Array.from(this.childNodes);
        if (childNodes.includes(otherNode)) {
            return true;
        }
        return childNodes.some((node) => this.contains.bind(node)(otherNode));
    }
    removeChild(childNode) {
        const index = this.childNodes.indexOf(childNode);
        if (index > -1) {
            this.childNodes.splice(index, 1);
            if (this.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
                const wasConnected = this.isConnected;
                childNode.parentNode = null;
                if (wasConnected === true) {
                    disconnectNode(childNode);
                }
            }
            else {
                childNode.parentNode = null;
            }
        }
        else {
            throw new Error(`node not found within childNodes during removeChild`);
        }
        return childNode;
    }
    remove() {
        if (this.parentNode != null) {
            this.parentNode.removeChild(this);
        }
    }
    replaceChild(newChild, oldChild) {
        if (oldChild.parentNode === this) {
            this.insertBefore(newChild, oldChild);
            oldChild.remove();
            return newChild;
        }
        return null;
    }
    get textContent() {
        var _a;
        return (_a = this._nodeValue) !== null && _a !== void 0 ? _a : '';
    }
    set textContent(value) {
        this._nodeValue = String(value);
    }
}
MockNode.ELEMENT_NODE = 1;
MockNode.TEXT_NODE = 3;
MockNode.PROCESSING_INSTRUCTION_NODE = 7;
MockNode.COMMENT_NODE = 8;
MockNode.DOCUMENT_NODE = 9;
MockNode.DOCUMENT_TYPE_NODE = 10;
MockNode.DOCUMENT_FRAGMENT_NODE = 11;
export class MockNodeList {
    constructor(ownerDocument, childNodes, length) {
        this.ownerDocument = ownerDocument;
        this.childNodes = childNodes;
        this.length = length;
    }
}
export class MockElement extends MockNode {
    attachInternals() {
        return new Proxy({}, {
            get: function (_target, prop, _receiver) {
                console.error(`NOTE: Property ${String(prop)} was accessed on ElementInternals, but this property is not implemented.
Testing components with ElementInternals is fully supported in e2e tests.`);
            },
        });
    }
    constructor(ownerDocument, nodeName, namespaceURI = null) {
        super(ownerDocument, 1 /* NODE_TYPES.ELEMENT_NODE */, typeof nodeName === 'string' ? nodeName : null, null);
        this.__namespaceURI = namespaceURI;
        this.__shadowRoot = null;
        this.__attributeMap = null;
    }
    addEventListener(type, handler) {
        addEventListener(this, type, handler);
    }
    attachShadow(_opts) {
        const shadowRoot = this.ownerDocument.createDocumentFragment();
        this.shadowRoot = shadowRoot;
        return shadowRoot;
    }
    blur() {
        dispatchEvent(this, new MockFocusEvent('blur', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
    }
    get namespaceURI() {
        return this.__namespaceURI;
    }
    get shadowRoot() {
        return this.__shadowRoot || null;
    }
    set shadowRoot(shadowRoot) {
        if (shadowRoot != null) {
            shadowRoot.host = this;
            this.__shadowRoot = shadowRoot;
        }
        else {
            delete this.__shadowRoot;
        }
    }
    get attributes() {
        if (this.__attributeMap == null) {
            const attrMap = createAttributeProxy(false);
            this.__attributeMap = attrMap;
            return attrMap;
        }
        return this.__attributeMap;
    }
    set attributes(attrs) {
        this.__attributeMap = attrs;
    }
    get children() {
        return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */);
    }
    get childElementCount() {
        return this.childNodes.filter((n) => n.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */).length;
    }
    get className() {
        return this.getAttributeNS(null, 'class') || '';
    }
    set className(value) {
        this.setAttributeNS(null, 'class', value);
    }
    get classList() {
        return new MockClassList(this);
    }
    click() {
        dispatchEvent(this, new MockEvent('click', { bubbles: true, cancelable: true, composed: true }));
    }
    cloneNode(_deep) {
        // implemented on MockElement.prototype from within element.ts
        // @ts-ignore - implemented on MockElement.prototype from within element.ts
        return null;
    }
    closest(selector) {
        let elm = this;
        while (elm != null) {
            if (elm.matches(selector)) {
                return elm;
            }
            elm = elm.parentNode;
        }
        return null;
    }
    get dataset() {
        return dataset(this);
    }
    get dir() {
        return this.getAttributeNS(null, 'dir') || '';
    }
    set dir(value) {
        this.setAttributeNS(null, 'dir', value);
    }
    dispatchEvent(ev) {
        return dispatchEvent(this, ev);
    }
    get firstElementChild() {
        return this.children[0] || null;
    }
    focus(_options) {
        dispatchEvent(this, new MockFocusEvent('focus', { relatedTarget: null, bubbles: true, cancelable: true, composed: true }));
    }
    getAttribute(attrName) {
        if (attrName === 'style') {
            if (this.__style != null && this.__style.length > 0) {
                return this.style.cssText;
            }
            return null;
        }
        const attr = this.attributes.getNamedItem(attrName);
        if (attr != null) {
            return attr.value;
        }
        return null;
    }
    getAttributeNS(namespaceURI, attrName) {
        const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
        if (attr != null) {
            return attr.value;
        }
        return null;
    }
    getAttributeNode(attrName) {
        if (!this.hasAttribute(attrName)) {
            return null;
        }
        return new MockAttr(attrName, this.getAttribute(attrName));
    }
    getBoundingClientRect() {
        return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 };
    }
    getRootNode(opts) {
        const isComposed = opts != null && opts.composed === true;
        let node = this;
        while (node.parentNode != null) {
            node = node.parentNode;
            if (isComposed === true && node.parentNode == null && node.host != null) {
                node = node.host;
            }
        }
        return node;
    }
    get draggable() {
        return this.getAttributeNS(null, 'draggable') === 'true';
    }
    set draggable(value) {
        this.setAttributeNS(null, 'draggable', value);
    }
    hasChildNodes() {
        return this.childNodes.length > 0;
    }
    get id() {
        return this.getAttributeNS(null, 'id') || '';
    }
    set id(value) {
        this.setAttributeNS(null, 'id', value);
    }
    get innerHTML() {
        if (this.childNodes.length === 0) {
            return '';
        }
        return serializeNodeToHtml(this, {
            newLines: false,
            indentSpaces: 0,
        });
    }
    set innerHTML(html) {
        var _a;
        if (NON_ESCAPABLE_CONTENT.has((_a = this.nodeName) !== null && _a !== void 0 ? _a : '') === true) {
            setTextContent(this, html);
        }
        else {
            for (let i = this.childNodes.length - 1; i >= 0; i--) {
                this.removeChild(this.childNodes[i]);
            }
            if (typeof html === 'string') {
                const frag = parseFragmentUtil(this.ownerDocument, html);
                while (frag.childNodes.length > 0) {
                    this.appendChild(frag.childNodes[0]);
                }
            }
        }
    }
    get innerText() {
        const text = [];
        getTextContent(this.childNodes, text);
        return text.join('');
    }
    set innerText(value) {
        setTextContent(this, value);
    }
    insertAdjacentElement(position, elm) {
        if (position === 'beforebegin') {
            insertBefore(this.parentNode, elm, this);
        }
        else if (position === 'afterbegin') {
            this.prepend(elm);
        }
        else if (position === 'beforeend') {
            this.appendChild(elm);
        }
        else if (position === 'afterend') {
            insertBefore(this.parentNode, elm, this.nextSibling);
        }
        return elm;
    }
    insertAdjacentHTML(position, html) {
        const frag = parseFragmentUtil(this.ownerDocument, html);
        if (position === 'beforebegin') {
            while (frag.childNodes.length > 0) {
                insertBefore(this.parentNode, frag.childNodes[0], this);
            }
        }
        else if (position === 'afterbegin') {
            while (frag.childNodes.length > 0) {
                this.prepend(frag.childNodes[frag.childNodes.length - 1]);
            }
        }
        else if (position === 'beforeend') {
            while (frag.childNodes.length > 0) {
                this.appendChild(frag.childNodes[0]);
            }
        }
        else if (position === 'afterend') {
            while (frag.childNodes.length > 0) {
                insertBefore(this.parentNode, frag.childNodes[frag.childNodes.length - 1], this.nextSibling);
            }
        }
    }
    insertAdjacentText(position, text) {
        const elm = this.ownerDocument.createTextNode(text);
        if (position === 'beforebegin') {
            insertBefore(this.parentNode, elm, this);
        }
        else if (position === 'afterbegin') {
            this.prepend(elm);
        }
        else if (position === 'beforeend') {
            this.appendChild(elm);
        }
        else if (position === 'afterend') {
            insertBefore(this.parentNode, elm, this.nextSibling);
        }
    }
    hasAttribute(attrName) {
        if (attrName === 'style') {
            return this.__style != null && this.__style.length > 0;
        }
        return this.getAttribute(attrName) !== null;
    }
    hasAttributeNS(namespaceURI, name) {
        return this.getAttributeNS(namespaceURI, name) !== null;
    }
    get hidden() {
        return this.hasAttributeNS(null, 'hidden');
    }
    set hidden(isHidden) {
        if (isHidden === true) {
            this.setAttributeNS(null, 'hidden', '');
        }
        else {
            this.removeAttributeNS(null, 'hidden');
        }
    }
    get lang() {
        return this.getAttributeNS(null, 'lang') || '';
    }
    set lang(value) {
        this.setAttributeNS(null, 'lang', value);
    }
    get lastElementChild() {
        const children = this.children;
        return children[children.length - 1] || null;
    }
    matches(selector) {
        return matches(selector, this);
    }
    get nextElementSibling() {
        const parentElement = this.parentElement;
        if (parentElement != null &&
            (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
                parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
                parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
            const children = parentElement.children;
            const index = children.indexOf(this) + 1;
            return parentElement.children[index] || null;
        }
        return null;
    }
    get outerHTML() {
        return serializeNodeToHtml(this, {
            newLines: false,
            outerHtml: true,
            indentSpaces: 0,
        });
    }
    get previousElementSibling() {
        const parentElement = this.parentElement;
        if (parentElement != null &&
            (parentElement.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */ ||
                parentElement.nodeType === 11 /* NODE_TYPES.DOCUMENT_FRAGMENT_NODE */ ||
                parentElement.nodeType === 9 /* NODE_TYPES.DOCUMENT_NODE */)) {
            const children = parentElement.children;
            const index = children.indexOf(this) - 1;
            return parentElement.children[index] || null;
        }
        return null;
    }
    getElementsByClassName(classNames) {
        const classes = classNames
            .trim()
            .split(' ')
            .filter((c) => c.length > 0);
        const results = [];
        getElementsByClassName(this, classes, results);
        return results;
    }
    getElementsByTagName(tagName) {
        const results = [];
        getElementsByTagName(this, tagName.toLowerCase(), results);
        return results;
    }
    querySelector(selector) {
        return selectOne(selector, this);
    }
    querySelectorAll(selector) {
        return selectAll(selector, this);
    }
    removeAttribute(attrName) {
        if (attrName === 'style') {
            delete this.__style;
        }
        else {
            const attr = this.attributes.getNamedItem(attrName);
            if (attr != null) {
                this.attributes.removeNamedItemNS(attr);
                if (checkAttributeChanged(this) === true) {
                    attributeChanged(this, attrName, attr.value, null);
                }
            }
        }
    }
    removeAttributeNS(namespaceURI, attrName) {
        const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
        if (attr != null) {
            this.attributes.removeNamedItemNS(attr);
            if (checkAttributeChanged(this) === true) {
                attributeChanged(this, attrName, attr.value, null);
            }
        }
    }
    removeEventListener(type, handler) {
        removeEventListener(this, type, handler);
    }
    setAttribute(attrName, value) {
        if (attrName === 'style') {
            this.style = value;
        }
        else {
            const attributes = this.attributes;
            let attr = attributes.getNamedItem(attrName);
            const checkAttrChanged = checkAttributeChanged(this);
            if (attr != null) {
                if (checkAttrChanged === true) {
                    const oldValue = attr.value;
                    attr.value = value;
                    if (oldValue !== attr.value) {
                        attributeChanged(this, attr.name, oldValue, attr.value);
                    }
                }
                else {
                    attr.value = value;
                }
            }
            else {
                if (attributes.caseInsensitive) {
                    attrName = attrName.toLowerCase();
                }
                attr = new MockAttr(attrName, value);
                attributes.__items.push(attr);
                if (checkAttrChanged === true) {
                    attributeChanged(this, attrName, null, attr.value);
                }
            }
        }
    }
    setAttributeNS(namespaceURI, attrName, value) {
        const attributes = this.attributes;
        let attr = attributes.getNamedItemNS(namespaceURI, attrName);
        const checkAttrChanged = checkAttributeChanged(this);
        if (attr != null) {
            if (checkAttrChanged === true) {
                const oldValue = attr.value;
                attr.value = value;
                if (oldValue !== attr.value) {
                    attributeChanged(this, attr.name, oldValue, attr.value);
                }
            }
            else {
                attr.value = value;
            }
        }
        else {
            attr = new MockAttr(attrName, value, namespaceURI);
            attributes.__items.push(attr);
            if (checkAttrChanged === true) {
                attributeChanged(this, attrName, null, attr.value);
            }
        }
    }
    get style() {
        if (this.__style == null) {
            this.__style = createCSSStyleDeclaration();
        }
        return this.__style;
    }
    set style(val) {
        if (typeof val === 'string') {
            if (this.__style == null) {
                this.__style = createCSSStyleDeclaration();
            }
            this.__style.cssText = val;
        }
        else {
            this.__style = val;
        }
    }
    get tabIndex() {
        return parseInt(this.getAttributeNS(null, 'tabindex') || '-1', 10);
    }
    set tabIndex(value) {
        this.setAttributeNS(null, 'tabindex', value);
    }
    get tagName() {
        var _a;
        return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
    }
    set tagName(value) {
        this.nodeName = value;
    }
    get textContent() {
        const text = [];
        getTextContent(this.childNodes, text);
        return text.join('');
    }
    set textContent(value) {
        setTextContent(this, value);
    }
    get title() {
        return this.getAttributeNS(null, 'title') || '';
    }
    set title(value) {
        this.setAttributeNS(null, 'title', value);
    }
    animate() {
        /**/
    }
    onanimationstart() {
        /**/
    }
    onanimationend() {
        /**/
    }
    onanimationiteration() {
        /**/
    }
    onabort() {
        /**/
    }
    onauxclick() {
        /**/
    }
    onbeforecopy() {
        /**/
    }
    onbeforecut() {
        /**/
    }
    onbeforepaste() {
        /**/
    }
    onblur() {
        /**/
    }
    oncancel() {
        /**/
    }
    oncanplay() {
        /**/
    }
    oncanplaythrough() {
        /**/
    }
    onchange() {
        /**/
    }
    onclick() {
        /**/
    }
    onclose() {
        /**/
    }
    oncontextmenu() {
        /**/
    }
    oncopy() {
        /**/
    }
    oncuechange() {
        /**/
    }
    oncut() {
        /**/
    }
    ondblclick() {
        /**/
    }
    ondrag() {
        /**/
    }
    ondragend() {
        /**/
    }
    ondragenter() {
        /**/
    }
    ondragleave() {
        /**/
    }
    ondragover() {
        /**/
    }
    ondragstart() {
        /**/
    }
    ondrop() {
        /**/
    }
    ondurationchange() {
        /**/
    }
    onemptied() {
        /**/
    }
    onended() {
        /**/
    }
    onerror() {
        /**/
    }
    onfocus() {
        /**/
    }
    onfocusin() {
        /**/
    }
    onfocusout() {
        /**/
    }
    onformdata() {
        /**/
    }
    onfullscreenchange() {
        /**/
    }
    onfullscreenerror() {
        /**/
    }
    ongotpointercapture() {
        /**/
    }
    oninput() {
        /**/
    }
    oninvalid() {
        /**/
    }
    onkeydown() {
        /**/
    }
    onkeypress() {
        /**/
    }
    onkeyup() {
        /**/
    }
    onload() {
        /**/
    }
    onloadeddata() {
        /**/
    }
    onloadedmetadata() {
        /**/
    }
    onloadstart() {
        /**/
    }
    onlostpointercapture() {
        /**/
    }
    onmousedown() {
        /**/
    }
    onmouseenter() {
        /**/
    }
    onmouseleave() {
        /**/
    }
    onmousemove() {
        /**/
    }
    onmouseout() {
        /**/
    }
    onmouseover() {
        /**/
    }
    onmouseup() {
        /**/
    }
    onmousewheel() {
        /**/
    }
    onpaste() {
        /**/
    }
    onpause() {
        /**/
    }
    onplay() {
        /**/
    }
    onplaying() {
        /**/
    }
    onpointercancel() {
        /**/
    }
    onpointerdown() {
        /**/
    }
    onpointerenter() {
        /**/
    }
    onpointerleave() {
        /**/
    }
    onpointermove() {
        /**/
    }
    onpointerout() {
        /**/
    }
    onpointerover() {
        /**/
    }
    onpointerup() {
        /**/
    }
    onprogress() {
        /**/
    }
    onratechange() {
        /**/
    }
    onreset() {
        /**/
    }
    onresize() {
        /**/
    }
    onscroll() {
        /**/
    }
    onsearch() {
        /**/
    }
    onseeked() {
        /**/
    }
    onseeking() {
        /**/
    }
    onselect() {
        /**/
    }
    onselectstart() {
        /**/
    }
    onstalled() {
        /**/
    }
    onsubmit() {
        /**/
    }
    onsuspend() {
        /**/
    }
    ontimeupdate() {
        /**/
    }
    ontoggle() {
        /**/
    }
    onvolumechange() {
        /**/
    }
    onwaiting() {
        /**/
    }
    onwebkitfullscreenchange() {
        /**/
    }
    onwebkitfullscreenerror() {
        /**/
    }
    onwheel() {
        /**/
    }
    requestFullscreen() {
        /**/
    }
    scrollBy() {
        /**/
    }
    scrollTo() {
        /**/
    }
    scrollIntoView() {
        /**/
    }
    toString(opts) {
        return serializeNodeToHtml(this, opts);
    }
}
function getElementsByClassName(elm, classNames, foundElms) {
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
function getElementsByTagName(elm, tagName, foundElms) {
    var _a;
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        if (tagName === '*' || ((_a = childElm.nodeName) !== null && _a !== void 0 ? _a : '').toLowerCase() === tagName) {
            foundElms.push(childElm);
        }
        getElementsByTagName(childElm, tagName, foundElms);
    }
}
export function resetElement(elm) {
    resetEventListeners(elm);
    delete elm.__attributeMap;
    delete elm.__shadowRoot;
    delete elm.__style;
}
function insertBefore(parentNode, newNode, referenceNode) {
    if (newNode !== referenceNode) {
        newNode.remove();
        newNode.parentNode = parentNode;
        newNode.ownerDocument = parentNode.ownerDocument;
        if (referenceNode != null) {
            const index = parentNode.childNodes.indexOf(referenceNode);
            if (index > -1) {
                parentNode.childNodes.splice(index, 0, newNode);
            }
            else {
                throw new Error(`referenceNode not found in parentNode.childNodes`);
            }
        }
        else {
            parentNode.childNodes.push(newNode);
        }
        connectNode(parentNode.ownerDocument, newNode);
    }
    return newNode;
}
export class MockHTMLElement extends MockElement {
    constructor(ownerDocument, nodeName) {
        super(ownerDocument, typeof nodeName === 'string' ? nodeName.toUpperCase() : null);
        this.__namespaceURI = 'http://www.w3.org/1999/xhtml';
    }
    get tagName() {
        var _a;
        return (_a = this.nodeName) !== null && _a !== void 0 ? _a : '';
    }
    set tagName(value) {
        this.nodeName = value;
    }
    get attributes() {
        if (this.__attributeMap == null) {
            const attrMap = createAttributeProxy(true);
            this.__attributeMap = attrMap;
            return attrMap;
        }
        return this.__attributeMap;
    }
    set attributes(attrs) {
        this.__attributeMap = attrs;
    }
}
export class MockTextNode extends MockNode {
    constructor(ownerDocument, text) {
        super(ownerDocument, 3 /* NODE_TYPES.TEXT_NODE */, "#text" /* NODE_NAMES.TEXT_NODE */, text);
    }
    cloneNode(_deep) {
        return new MockTextNode(null, this.nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    set textContent(text) {
        this.nodeValue = text;
    }
    get data() {
        return this.nodeValue;
    }
    set data(text) {
        this.nodeValue = text;
    }
    get wholeText() {
        if (this.parentNode != null) {
            const text = [];
            for (let i = 0, ii = this.parentNode.childNodes.length; i < ii; i++) {
                const childNode = this.parentNode.childNodes[i];
                if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
                    text.push(childNode.nodeValue);
                }
            }
            return text.join('');
        }
        return this.nodeValue;
    }
}
function getTextContent(childNodes, text) {
    for (let i = 0, ii = childNodes.length; i < ii; i++) {
        const childNode = childNodes[i];
        if (childNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
            text.push(childNode.nodeValue);
        }
        else if (childNode.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
            getTextContent(childNode.childNodes, text);
        }
    }
}
function setTextContent(elm, text) {
    for (let i = elm.childNodes.length - 1; i >= 0; i--) {
        elm.removeChild(elm.childNodes[i]);
    }
    const textNode = new MockTextNode(elm.ownerDocument, text);
    elm.appendChild(textNode);
}
//# sourceMappingURL=node.js.map