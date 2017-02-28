import { DomApi } from './dom-api';
import { isDef, toCamelCase } from '../../utils/helpers';


export class BrowserDomApi implements DomApi {

  constructor(private d: HTMLDocument) {}

  createElement(tagName: any): HTMLElement {
    return this.d.createElement(tagName);
  }

  createElementNS(namespaceURI: string, qualifiedName: string): Element {
    return this.d.createElementNS(namespaceURI, qualifiedName);
  }

  createTextNode(text: string): Text {
    return this.d.createTextNode(text);
  }

  createComment(text: string): Comment {
    return this.d.createComment(text);
  }

  insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(newNode, referenceNode);
  }

  removeChild(node: Node, child: Node): void {
    node.removeChild(child);
  }

  appendChild(node: Node, child: Node): void {
    node.appendChild(child);
  }

  parentNode(node: Node): Node | null {
    return node.parentNode;
  }

  nextSibling(node: Node): Node | null {
    return node.nextSibling;
  }

  tagName(elm: Element): string {
    return elm.tagName;
  }

  setTextContent(node: Node, text: string | null): void {
    node.textContent = text;
  }

  getTextContent(node: Node): string | null {
    return node.textContent;
  }

  getAttribute(elm: HTMLElement, attrName: string): string {
    return elm.getAttribute(attrName);
  }

  getProperty(node: Node, propName: string): any {
    return (<any>node)[propName];
  }

  getPropOrAttr(elm: HTMLElement, name: string): any {
    const val = (<any>elm)[toCamelCase(name)];
    return isDef(val) ? val : elm.getAttribute(name);
  }

  setStyle(elm: HTMLElement, styleName: string, styleValue: any) {
    (<any>elm.style)[toCamelCase(styleName)] = styleValue;
  }

  isElement(node: Node): node is Element {
    return node.nodeType === 1;
  }

  isText(node: Node): node is Text {
    return node.nodeType === 3;
  }

  isComment(node: Node): node is Comment {
    return node.nodeType === 8;
  }

}
