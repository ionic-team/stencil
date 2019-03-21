import { attributeChanged, checkAttributeChanged, connectNode, disconnectNode } from './custom-element-registry';
import { closest, matches, selectAll, selectOne } from './selector';
import { CSSStyleDeclaration, createCSSStyleDeclaration } from './css-style-declaration';
import { MockAttr, MockAttributeMap, cloneAttributes } from './attribute';
import { MockClassList } from './class-list';
import { MockEvent, addEventListener, dispatchEvent, removeEventListener, resetEventListeners } from './event';
import { NODE_NAMES, NODE_TYPES } from './constants';
import { NON_ESCAPABLE_CONTENT, SerializeElementOptions, serializeNodeToHtml } from './serialize-node';
import { parseFragmentUtil } from './parse-util';


export class MockNode {
  nodeName: string;
  nodeType: number;
  nodeValue: string;
  ownerDocument: any;
  parentNode: MockNode;
  childNodes: MockNode[];

  constructor(ownerDocument: any, nodeType: number, nodeName: string, nodeValue: string) {
    this.ownerDocument = ownerDocument;
    this.nodeType = nodeType;
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
    this.parentNode = null;
    this.childNodes = [];
  }

  appendChild(newNode: MockNode) {
    newNode.remove();
    newNode.parentNode = this;
    this.childNodes.push(newNode);
    connectNode(this.ownerDocument, newNode);
    return newNode;
  }

  cloneNode(deep?: boolean): MockNode {
    throw new Error(`invalid node type to clone: ${this.nodeType}, deep: ${deep}`);
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  insertBefore(newNode: MockNode, referenceNode: MockNode) {
    if (newNode.nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE) {
      for (let i = 0, ii = newNode.childNodes.length; i < ii; i++) {
        insertBefore(this, newNode.childNodes[i], referenceNode);
      }
    } else {
      insertBefore(this, newNode, referenceNode);
    }

    return newNode;
  }

  get isConnected() {
    let node = this as any;
    while (node != null) {
      if (node.nodeType === NODE_TYPES.DOCUMENT_NODE) {
        return true;
      }

      node = node.parentNode;

      if (node != null && node.nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE) {
        node = node.host;
      }
    }

    return false;
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

  get parentElement() {
    return ((this.parentNode as any) as MockElement) || null;
  }
  set parentElement(value: any) {
    this.parentNode = value;
  }

  get previousSibling() {
    if (this.parentNode != null) {
      const index = this.parentNode.childNodes.indexOf(this) - 1;
      return this.parentNode.childNodes[index] || null;
    }
    return null;
  }

  removeChild(childNode: MockNode) {
    const index = this.childNodes.indexOf(childNode);
    if (index > -1) {
      this.childNodes.splice(index, 1);

      if (this.nodeType === NODE_TYPES.ELEMENT_NODE) {
        const wasConnected = this.isConnected;

        childNode.parentNode = null;

        if (wasConnected === true) {
          disconnectNode(childNode);
        }

      } else {
        childNode.parentNode = null;
      }

    } else {
      throw new Error(`node not found within childNodes during removeChild`);
    }
    return childNode;
  }

  remove() {
    if (this.parentNode != null) {
      this.parentNode.removeChild(this);
    }
  }

  replaceChild(newChild: MockNode, oldChild: MockNode) {
    if (oldChild.parentNode === this) {
      this.insertBefore(newChild, oldChild);
      oldChild.remove();
      return newChild;
    }
    return null;
  }

  get textContent() {
    return this.nodeValue;
  }
  set textContent(value: string) {
    this.nodeValue = String(value);
  }

  static ELEMENT_NODE = 1;
  static TEXT_NODE = 3;
  static PROCESSING_INSTRUCTION_NODE = 7;
  static COMMENT_NODE = 8;
  static DOCUMENT_NODE = 9;
  static DOCUMENT_TYPE_NODE = 10;
  static DOCUMENT_FRAGMENT_NODE = 11;
}


const stylesMap = new WeakMap<MockElement, CSSStyleDeclaration>();
const attrsMap = new WeakMap<MockElement, MockAttributeMap>();

export class MockElement extends MockNode {
  namespaceURI: string;
  private _shadowRoot: ShadowRoot;

  constructor(ownerDocument: any, nodeName: string) {
    super(
      ownerDocument,
      NODE_TYPES.ELEMENT_NODE,
      typeof nodeName === 'string' ? nodeName.toUpperCase() : null,
      null
    );
    this.namespaceURI = null;
  }

  addEventListener(type: string, handler: (ev?: any) => void) {
    addEventListener(this, type, handler);
  }

  attachShadow(_opts: ShadowRootInit) {
    this._shadowRoot = this.ownerDocument.createDocumentFragment();
    (this._shadowRoot as any).host = this;
    return this._shadowRoot;
  }

  get shadowRoot() {
    return this._shadowRoot || null;
  }
  set shadowRoot(value: any) {
    this._shadowRoot = value;
  }

  get attributes() {
    let attrs = attrsMap.get(this);
    if (attrs == null) {
      attrs = new MockAttributeMap();
      attrsMap.set(this, attrs);
    }
    return attrs;
  }
  set attributes(attrs: MockAttributeMap) {
    attrsMap.set(this, attrs);
  }

  get children() {
    return this.childNodes.filter(n => n.nodeType === NODE_TYPES.ELEMENT_NODE) as MockElement[];
  }

  get childElementCount() {
    return this.childNodes.filter(n => n.nodeType === NODE_TYPES.ELEMENT_NODE).length;
  }

  get className() { return this.getAttributeNS(null, 'class') || ''; }
  set className(value: string) { this.setAttributeNS(null, 'class', value); }

  get classList() {
    return new MockClassList(this as any);
  }

  click() {
    dispatchEvent(this, new MockEvent('click', { bubbles: true, cancelable: true, composed: true }));
  }

  cloneNode(deep?: boolean) {
    const cloned = new MockElement(null, this.nodeName);
    cloned.attributes = cloneAttributes(this.attributes);

    if (deep) {
      for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
        const clonedChildNode = this.childNodes[i].cloneNode(true);
        cloned.appendChild(clonedChildNode);
      }
    }

    return cloned;
  }

  closest(selector: string) {
    return closest(selector, this);
  }

  get dir() { return this.getAttributeNS(null, 'dir') || ''; }
  set dir(value: string) { this.setAttributeNS(null, 'dir', value); }

  dispatchEvent(ev: MockEvent) {
    return dispatchEvent(this, ev);
  }

  get firstElementChild() {
    return this.children[0] || null;
  }

  getAttribute(attrName: string) {
    attrName = attrName.toLowerCase();
    if (attrName === 'style') {
      const style = stylesMap.get(this);
      if (style != null && style.length > 0) {
        return this.style.cssText;
      }
      return null;
    }
    return this.getAttributeNS(null, attrName);
  }

  getAttributeNS(namespaceURI: string, name: string) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, name);
    if (attr != null) {
      return attr.value;
    }
    return null;
  }

  getBoundingClientRect() {
    return { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 };
  }

  getRootNode(opts?: { composed?: boolean; [key: string]: any; }) {
    const isComposed = (opts != null && opts.composed === true);

    let node: Node = this as any;

    while (node.parentNode != null) {
      node = node.parentNode;

      if (isComposed === true && node.parentNode == null && (node as any).host != null) {
        node = (node as any).host;
      }
    }

    return node;
  }

  get id() { return this.getAttributeNS(null, 'id') || ''; }
  set id(value: string) { this.setAttribute('id', value); }

  get innerHTML() {
    if (this.childNodes.length === 0) {
      return '';
    }
    return serializeNodeToHtml(this as any, {
      newLines: false,
      indentSpaces: 0
    });
  }

  set innerHTML(html: string) {
    if (NON_ESCAPABLE_CONTENT.has(this.nodeName) === true) {
      setTextContent(this, html);

    } else {
      for (let i = this.childNodes.length - 1; i >= 0; i--) {
        this.removeChild(this.childNodes[i]);
      }

      if (typeof html === 'string') {
        const frag = parseFragmentUtil(this.ownerDocument, html);
        for (let i = 0, ii = frag.childNodes.length; i < ii; i++) {
          this.appendChild(frag.childNodes[i]);
        }
      }
    }
  }

  get innerText() {
    const text: string[] = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }

  set innerText(value: string) {
    setTextContent(this, value);
  }

  hasAttribute(attrName: string) {
    attrName = attrName.toLowerCase();
    if (attrName === 'style') {
      const style = stylesMap.get(this);
      return (style != null && style.length > 0);
    }
    return this.getAttributeNS(null, attrName) !== null;
  }

  hasAttributeNS(namespaceURI: string, name: string) {
    return this.getAttributeNS(namespaceURI, name) !== null;
  }

  get hidden() { return this.hasAttributeNS(null, 'hidden'); }
  set hidden(isHidden: boolean) {
    if (isHidden === true) {
      this.setAttributeNS(null, 'hidden', '');
    } else {
      this.removeAttributeNS(null, 'hidden');
    }
  }

  get lang() { return this.getAttributeNS(null, 'lang') || ''; }
  set lang(value: string) { this.setAttributeNS(null, 'lang', value); }

  get lastElementChild() {
    const children = this.children;
    return children[children.length - 1] || null;
  }

  matches(selector: string) {
    return matches(selector, this);
  }

  get nextElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null && (parentElement.nodeType === NODE_TYPES.ELEMENT_NODE || parentElement.nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE || parentElement.nodeType === NODE_TYPES.DOCUMENT_NODE)) {
      const children = parentElement.children;
      const index = children.indexOf(this) + 1;
      return parentElement.children[index] || null;
    }
    return null;
  }

  get outerHTML() {
    return serializeNodeToHtml(this as any, {
      outerHTML: true,
      newLines: false,
      indentSpaces: 0
    });
  }

  get previousElementSibling() {
    const parentElement = this.parentElement;
    if (parentElement != null && (parentElement.nodeType === NODE_TYPES.ELEMENT_NODE || parentElement.nodeType === NODE_TYPES.DOCUMENT_FRAGMENT_NODE || parentElement.nodeType === NODE_TYPES.DOCUMENT_NODE)) {
      const children = parentElement.children;
      const index = children.indexOf(this) - 1;
      return parentElement.children[index] || null;
    }
    return null;
  }

  querySelector(selector: string) {
    return selectOne(selector, this);
  }

  querySelectorAll(selector: string) {
    return selectAll(selector, this);
  }

  removeAttribute(attrName: string) {
    attrName = attrName.toLowerCase();
    if (attrName === 'style') {
      stylesMap.delete(this);
    } else {
      this.removeAttributeNS(null, attrName);
    }
  }

  removeAttributeNS(namespaceURI: string, attrName: string) {
    const attr = this.attributes.getNamedItemNS(namespaceURI, attrName);
    if (attr != null) {
      this.attributes.removeNamedItemNS(attr);
      if (checkAttributeChanged(this) === true) {
        attributeChanged(this, attrName, attr.value, null);
      }
    }
  }

  removeEventListener(type: string, handler: any) {
    removeEventListener(this, type, handler);
  }

  setAttribute(attrName: string, value: any) {
    attrName = attrName.toLowerCase();
    if (attrName === 'style') {
      this.style = value;
    } else {
      this.setAttributeNS(null, attrName, value);
    }
  }

  setAttributeNS(namespaceURI: string, attrName: string, value: any) {
    const attributes = this.attributes;
    let attr = attributes.getNamedItemNS(namespaceURI, attrName);
    const checkAttrChanged = checkAttributeChanged(this);

    if (attr != null) {
      if (checkAttrChanged === true) {
        const oldValue = attr.value;
        attr.value = String(value);

        if (oldValue !== attr.value) {
          attributeChanged(this, attrName, oldValue, attr.value);
        }
      } else {
        attr.value = String(value);
      }

    } else {
      attr = new MockAttr(attrName, value, namespaceURI);
      attributes.items.push(attr);

      if (checkAttrChanged === true) {
        attributeChanged(this, attrName, null, attr.value);
      }
    }
  }

  get style() {
    let style = stylesMap.get(this);
    if (style == null) {
      style = createCSSStyleDeclaration();
      stylesMap.set(this, style);
    }
    return style;
  }
  set style(val: any) {
    if (typeof val === 'string') {
      let style = stylesMap.get(this);
      if (style == null) {
        style = createCSSStyleDeclaration();
        stylesMap.set(this, style);
      }
      style.cssText = val;

    } else {
      stylesMap.set(this, val);
    }
  }

  get tabIndex() { return parseInt(this.getAttributeNS(null, 'tabindex') || '-1', 10); }
  set tabIndex(value: number) { this.setAttributeNS(null, 'tabindex', value); }

  get tagName() { return this.nodeName; }
  set tagName(value: string) { this.nodeName = value.toUpperCase(); }

  get textContent() {
    const text: string[] = [];
    getTextContent(this.childNodes, text);
    return text.join('');
  }
  set textContent(value: string) {
    setTextContent(this, value);
  }

  get title() { return this.getAttributeNS(null, 'title') || ''; }
  set title(value: string) { this.setAttributeNS(null, 'title', value); }

  onabort() {/**/}
  onauxclick() {/**/}
  onbeforecopy() {/**/}
  onbeforecut() {/**/}
  onbeforepaste() {/**/}
  onblur() {/**/}
  oncancel() {/**/}
  oncanplay() {/**/}
  oncanplaythrough() {/**/}
  onchange() {/**/}
  onclick() {/**/}
  onclose() {/**/}
  oncontextmenu() {/**/}
  oncopy() {/**/}
  oncuechange() {/**/}
  oncut() {/**/}
  ondblclick() {/**/}
  ondrag() {/**/}
  ondragend() {/**/}
  ondragenter() {/**/}
  ondragleave() {/**/}
  ondragover() {/**/}
  ondragstart() {/**/}
  ondrop() {/**/}
  ondurationchange() {/**/}
  onemptied() {/**/}
  onended() {/**/}
  onerror() {/**/}
  onfocus() {/**/}
  onformdata() {/**/}
  onfullscreenchange() {/**/}
  onfullscreenerror() {/**/}
  ongotpointercapture() {/**/}
  oninput() {/**/}
  oninvalid() {/**/}
  onkeydown() {/**/}
  onkeypress() {/**/}
  onkeyup() {/**/}
  onload() {/**/}
  onloadeddata() {/**/}
  onloadedmetadata() {/**/}
  onloadstart() {/**/}
  onlostpointercapture() {/**/}
  onmousedown() {/**/}
  onmouseenter() {/**/}
  onmouseleave() {/**/}
  onmousemove() {/**/}
  onmouseout() {/**/}
  onmouseover() {/**/}
  onmouseup() {/**/}
  onmousewheel() {/**/}
  onpaste() {/**/}
  onpause() {/**/}
  onplay() {/**/}
  onplaying() {/**/}
  onpointercancel() {/**/}
  onpointerdown() {/**/}
  onpointerenter() {/**/}
  onpointerleave() {/**/}
  onpointermove() {/**/}
  onpointerout() {/**/}
  onpointerover() {/**/}
  onpointerup() {/**/}
  onprogress() {/**/}
  onratechange() {/**/}
  onreset() {/**/}
  onresize() {/**/}
  onscroll() {/**/}
  onsearch() {/**/}
  onseeked() {/**/}
  onseeking() {/**/}
  onselect() {/**/}
  onselectstart() {/**/}
  onstalled() {/**/}
  onsubmit() {/**/}
  onsuspend() {/**/}
  ontimeupdate() {/**/}
  ontoggle() {/**/}
  onvolumechange() {/**/}
  onwaiting() {/**/}
  onwebkitfullscreenchange() {/**/}
  onwebkitfullscreenerror() {/**/}
  onwheel() {/**/}

  toString(opts?: SerializeElementOptions) {
    return serializeNodeToHtml(this as any, opts);
  }

}

export function resetElement(elm: any) {
  resetEventListeners(elm);
  attrsMap.delete(elm);
  try {
    elm.shadowRoot = null;
  } catch (e) {}
}

function insertBefore(parentNode: MockNode, newNode: MockNode, referenceNode: MockNode) {
  newNode.remove();
  newNode.parentNode = parentNode;
  newNode.ownerDocument = parentNode.ownerDocument;

  if (referenceNode != null) {
    const index = parentNode.childNodes.indexOf(referenceNode);
    if (index > -1) {
      parentNode.childNodes.splice(index, 0, newNode);

    } else {
      throw new Error(`referenceNode not found in parentNode.childNodes`);
    }

  } else {
    parentNode.childNodes.push(newNode);
  }

  connectNode(parentNode.ownerDocument, newNode);

  return newNode;
}


export class MockTextNode extends MockNode {

  constructor(ownerDocument: any, text: string) {
    super(
      ownerDocument,
      NODE_TYPES.TEXT_NODE,
      NODE_NAMES.TEXT_NODE,
      text
    );
  }

  cloneNode(_deep?: boolean) {
    return new MockTextNode(null, this.nodeValue);
  }

  get textContent() {
    return this.nodeValue;
  }
  set textContent(text) {
    this.nodeValue = text;
  }

  get wholeText() {
    if (this.parentNode != null) {
      const text: string[] = [];
      for (let i = 0, ii = this.parentNode.childNodes.length; i < ii; i++) {
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


function getTextContent(childNodes: MockNode[], text: string[]) {
  for (let i = 0, ii = childNodes.length; i < ii; i++) {
    const childNode = childNodes[i];
    if (childNode.nodeType === NODE_TYPES.TEXT_NODE) {
      text.push(childNode.nodeValue);

    } else if (childNode.nodeType === NODE_TYPES.ELEMENT_NODE) {
      getTextContent(childNode.childNodes, text);
    }
  }
}


function setTextContent(elm: MockElement, text: string) {
  for (let i = elm.childNodes.length - 1; i >= 0; i--) {
    elm.removeChild(elm.childNodes[i]);
  }
  const textNode = new MockTextNode(elm.ownerDocument, text);
  elm.appendChild(textNode);
}
