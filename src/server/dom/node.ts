import { querySelector, querySelectorAll, createSelectors } from './selectors';
import { adapter } from './adapter';


export class Node {
  private _classList: ClassList;
  private _style: {[prop: string]: any};

  type: string;
  data: string;
  name: string;
  parent: Node;
  prev: Node;
  next: Node;
  children: Node[];
  namespace: string;
  attribs: {[attrName: string]: any};
  'x-attribsNamespace': {[attrName: string]: any};
  'x-attribsPrefix': {[attrName: string]: any};
  'x-mode': string;
  'x-name': string;
  'x-publicId': string;
  'x-systemId': string;

  get classList() {
    if (!this._classList) {
      this._classList = new ClassList(this);
    }
    return this._classList;
  }

  get style() {
    if (!this._style) {
      this._style = {};
    }
    return this._style;
  }

  get tagName() {
    return this.name;
  }

  get childNodes() {
    return this.children;
  }

  get parentNode() {
    return this.parent;
  }

  get parentElement() {
    return this.parent;
  }

  get previousSibling() {
    return this.prev;
  }

  get nextSibling() {
    return this.next;
  }

  get nodeValue() {
    return this.data;
  }

  get nodeType() {
    return nodeTypes[this.type] || nodeTypes.element;
  }

  firstChild() {
    return this.children && this.children[0] || null;
  }

  lastChild() {
    return this.children && this.children[this.children.length - 1] || null;
  }

  get className() {
    return this.getAttribute('class') || '';
  }

  set className(cssClassName: string) {
    if (typeof cssClassName === 'string') {
      this.setAttribute('class', cssClassName.trim());
    }
  }

  get id() {
    return this.getAttribute('id') || '';
  }

  set id(id: string) {
    this.setAttribute('id', id);
  }

  get tabIndex() {
    return this.getAttribute('tabindex') || '';
  }

  set tabIndex(id: string) {
    this.setAttribute('tabindex', id.trim());
  }

  getAttribute(attrName: string) {
    if (this.attribs) {
      let attrValue = this.attribs[attrName];
      if (attrValue !== undefined && attrValue !== null) {
        return attrValue.toString();
      }
    }
    return null;
  }

  setAttribute(attrName: string, attrValue: string) {
    if (this.attribs) {
      if (attrValue === null || attrValue === undefined) {
        this.removeAttribute(attrName);

      } else {
        this.attribs[attrName] = attrValue.toString();
        this['x-attribsNamespace'][attrName] = null;
        this['x-attribsPrefix'][attrName] = null;
      }
    }
  }

  hasAttribute(attrName: string) {
    if (this.attribs) {
      return Object.keys(this.attribs).indexOf(attrName) > -1;
    }
    return false;
  }

  removeAttribute(attrName: string) {
    if (this.attribs) {
      delete this.attribs[attrName];
      delete this['x-attribsNamespace'][attrName];
      delete this['x-attribsPrefix'][attrName];
    }
  }

  insertBefore(newNode: Node, referenceNode: Node): void {
    adapter.insertBefore(this, newNode, referenceNode);
  }

  removeChild(childNode: Node): void {
    adapter.detachNode(childNode);
  }

  appendChild(childNode: Node): void {
    adapter.appendChild(this, childNode);
  }

  get textContent() {
    const text: string[] = [];

    concatText(text, this);

    return text.join('');
  }

  set textContent(text: string) {
    if (this.type === 'text') {
      this.data = text;

    } else if (this.children) {
      if (this.children.length === 1 && this.type === 'text') {
        this.children[0].data = text;

      } else {
        this.children.forEach(adapter.detachNode);

        adapter.insertText(this, text);
      }
    }
  }

  querySelector(selector: string) {
    const selectors = createSelectors(selector);
    if (selectors.length) {
      return querySelector(this, selectors);
    }
    return null;
  }

  querySelectorAll(selector: string) {
    const selectors = createSelectors(selector);
    const foundNodes: Node[] = [];

    if (selectors.length) {
      querySelectorAll(foundNodes, this, selectors);
    }

    return foundNodes;
  }

  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {}
  focus() {}
  blur() {}

  $destroy() {
    if (this.children) {
      for (var i = 0; i < this.children.length; i++) {
        this.children[i].$destroy();
      }
    }
    if (this._classList) {
      this._classList.$destory();
    }
    delete this.children;
    delete this.next;
    delete this.parent;
    delete this.prev;
    delete this.attribs;
  }

}

function concatText(text: string[], node: Node) {
  if (node.type === 'text') {
    if (node.data !== undefined && node.data !== null) {
      text.push(node.data);
    }

  } else if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      concatText(text, node.children[i]);
    }
  }
}


export class ClassList {

  constructor(private node: Node) {}

  add() {
    const args = arguments;
    const classes = this.node.className.split(' ');

    for (var i = 0; i < args.length; i++) {
      if (classes.indexOf(args[i]) === -1 && typeof args[i] === 'string') {
        classes.push(args[i]);
      }
    }

    this.node.className = classes.map(c => c.trim()).filter(c => c.length).join(' ');
  }

  remove() {
    const args = arguments;
    const classes = this.node.className.split(' ');

    for (var i = 0; i < args.length; i++) {
      for (var j = classes.length - 1; j >= 0; j--) {
        if (args[i] === classes[j]) {
          classes.splice(j, 1);
        }
      }
    }

    this.node.className = classes.map(c => c.trim()).filter(c => c.length).join(' ');
  }

  contains(cssClassName: string) {
    return this.node.className.split(' ').indexOf(cssClassName) > -1;
  }

  toggle(cssClassName: string, force?: boolean) {
    const classes = this.node.className.split(' ');

    if (force === true) {
      if (classes.indexOf(cssClassName) === -1 && typeof cssClassName === 'string') {
        classes.push(cssClassName);
      }
    } else if (force === false) {
      for (let j = classes.length - 1; j >= 0; j--) {
        if (cssClassName === classes[j]) {
          classes.splice(j, 1);
        }
      }
    } else {
      if (classes.indexOf(cssClassName) === -1 && typeof cssClassName === 'string') {
        classes.push(cssClassName);
      } else {
        for (let j = classes.length - 1; j >= 0; j--) {
          if (cssClassName === classes[j]) {
            classes.splice(j, 1);
          }
        }
      }
    }

    return this.node.className.split(' ').indexOf(cssClassName) > -1;
  }

  $destory() {
    this.node = null;
  }

}


// Conversion tables for DOM Level1 structure emulation
const nodeTypes: {[key: string]: number} = {
  element: 1,
  text: 3,
  cdata: 4,
  comment: 8
};
