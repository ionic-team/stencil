import { adapter, createElement, appendChild, insertText } from './adapter';
import { Location } from './location';
import { Node } from './node';
import { createSelectors, getAllSelectors, getElementById, getElementsByClassName,
  getElementsName, getElementsByTagName, hasChildNodes, querySelector, querySelectorAll } from './selectors';
import * as parse5 from 'parse5';


export class Document {
  private $ast: Node;
  private _documentElement: Node;
  private _head: Node;
  private _title: Node;
  private _body: Node;
  defaultView: any;
  location: Location;
  cookie: string;
  referrer: string;


  $parse(html: string) {
    this.$ast = <any>parse5.parse(html, {
      treeAdapter: adapter
    });
    return this.$ast;
  }

  $serialize() {
    return parse5.serialize(this.$ast, {
      treeAdapter: adapter
    });
  }

  $applyCss(css: string) {
    if (!css || !css.length) return;

    const styleNode: Node = createElement('style', null, []);
    insertText(styleNode, css);

    appendChild(this.head, styleNode);
  }

  $getAllSelectors() {
    const selectors: {[selector: string]: boolean} = {};

    getAllSelectors(this.$ast, selectors);

    return selectors;
  }

  $destroy() {
    this.$ast.$destroy();
    this.$ast = this.location = this.defaultView = this._documentElement = this._head = this._body = null;
  }

  get documentElement() {
    if (!this._documentElement) {
      this._documentElement = this.querySelector('html');
    }
    return this._documentElement;
  }

  get head() {
    if (!this._head) {
      this._head = this.querySelector('head');
    }
    return this._head;
  }

  get body() {
    if (!this._body) {
      this._body = this.querySelector('body');
    }
    return this._body;
  }

  get dir() {
    return this.documentElement.getAttribute('dir') || '';
  }

  set dir(value: string) {
    this.documentElement.setAttribute('dir', value);
  }

  get title() {
    if (!this._title) {
      this._title = this.querySelector('title');
    }
    if (this._title) {
      return this._title.textContent;
    }
    return '';
  }

  set title(value: string) {
    if (!this._title) {
      this._title = this.querySelector('title');
    }
    if (!this._title) {
      this._title = <Node>adapter.createElement('title', null, []);
      this.head.appendChild(this._title);
    }
    this._title.textContent = value;
  }

  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K) {
    const node: any = adapter.createElement(tagName, null, []);
    return node;
  }

  createElementNS(namespaceUri: string, qualifiedName: string) {
    const node: any = adapter.createElement(qualifiedName, namespaceUri, []);
    return node;
  }

  createTextNode(text: string) {
    const node: any = adapter.createCommentNode(text);
    node.type = 'text';
    return node;
  }

  createComment(data: string) {
    const node: any = adapter.createCommentNode(data);
    return node;
  }

  createDocumentFragment() {
    const node: any = adapter.createDocumentFragment();
    return node;
  }

  createCDATASection(data: string) {
    const node: any = adapter.createCommentNode(data);
    return node;
  }

  cloneNode() {
    return Object.assign({}, this.$ast);
  }

  getElementById(id: string) {
    return getElementById(this.$ast, id);
  }

  getElementsByTagName(tagName: string) {
    const foundNodes: Node[] = [];

    if (typeof tagName === 'string') {
      getElementsByTagName(foundNodes, this.$ast, tagName.trim().toLowerCase());
    }

    return foundNodes;
  }

  getElementsByTagNameNS(tagName: string) {
    const foundNodes: Node[] = [];

    if (typeof tagName === 'string') {
      getElementsByTagName(foundNodes, this.$ast, tagName.trim().toLowerCase());
    }

    return foundNodes;
  }

  getElementsByClassName(className: string) {
    const foundNodes: Node[] = [];

    if (typeof className === 'string') {
      getElementsByClassName(foundNodes, this.$ast, className.trim());
    }

    return foundNodes;
  }

  getElementsName(attrName: string) {
    const foundNodes: Node[] = [];

    if (typeof attrName === 'string') {
      getElementsName(foundNodes, this.$ast, attrName.trim());
    }

    return foundNodes;
  }

  querySelector(selector: string) {
    const selectors = createSelectors(selector);
    if (selectors.length) {
      return querySelector(this.$ast, selectors);
    }
    return null;
  }

  querySelectorAll(selector: string) {
    const selectors = createSelectors(selector);
    const foundNodes: Node[] = [];

    if (selectors.length) {
      querySelectorAll(foundNodes, this.$ast, selectors);
    }

    return foundNodes;
  }

  hasChildNodes() {
    return hasChildNodes(this.$ast);
  }


  // noops
  addEventListener() {}
  blur() {}
  captureEvents() {}
  caretRangeFromPoint() {}
  createExpression() {}
  createNSResolver() {}
  close() {}
  compareDocumentPosition() {}
  createProcessingInstruction() {}
  dispatchEvent() {}
  elementFromPoint() {}
  elementsFromPoint() {}
  evaluate() {}
  execCommand() {}
  exitPointerLock() {}
  focus() {}
  getSelection() {}
  hasFocus() {}
  open() {}
  queryCommandEnabled() {}
  queryCommandIndeterm() {}
  queryCommandState() {}
  queryCommandSupported() {}
  queryCommandValue() {}
  releaseEvents() {}
  removeEventListener() {}
  write() {}
  writeln() {}

}
