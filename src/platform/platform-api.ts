import { ComponentMeta, LoadComponentCallback } from '../utils/interfaces';


export interface PlatformApi {
  registerComponent: (cmpMeta: ComponentMeta) => void;
  loadComponentModule: (tag: string, mode: string, cb: LoadComponentCallback) => void ;
  createElement: (tagName: any) => HTMLElement;
  createElementNS: (namespaceURI: string, qualifiedName: string) => Element;
  createTextNode: (text: string) => Text;
  createComment: (text: string) => Comment;
  insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
  removeChild: (parentNode: Node, childNode: Node) => void;
  appendChild: (parentNode: Node, childNode: Node) => void;
  parentNode: (node: Node) => Node;
  nextSibling: (node: Node) => Node;
  tag: (elm: Element) => string;
  setTextContent: (node: Node, text: string | null) => void;
  getTextContent: (node: Node) => string | null;
  getAttribute: (elm: Element, attrName: string) => string;
  setAttribute: (elm: Element, attrName: string, attrValue: any) => void;
  getProperty: (node: Node, propName: string) => string;
  setProperty: (node: Node, propName: string, propValue: any) => void;
  setStyle: (elm: Element, styleName: string, styleValue: any) => void;
  isElement: (node: Node) => node is Element;
  isText: (node: Node) => node is Text;
  isComment: (node: Node) => node is Comment;
  nextTick: (cb: Function) => void;
  staticDir: string;
  hasCss: (moduleId: string) => boolean;
  setCss: (moduleId: string) => void;
  getDocumentHead: () => HTMLHeadElement;
}
