import { ComponentMeta, ComponentModule, ComponentRegistry } from '../utils/interfaces';


export interface PlatformApi {
  registerComponent: (cmpMeta: ComponentMeta) => void;
  getComponentMeta: (tag: string) => ComponentMeta;
  loadComponentModule: (tag: string, cb: {(cmpMeta: ComponentMeta, cmpModule: ComponentModule): void}) => void;
  createElement: (tagName: any) => HTMLElement;
  createElementNS: (namespaceURI: string, qualifiedName: string) => Element;
  createTextNode: (text: string) => Text;
  createComment: (text: string) => Comment;
  insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
  removeChild: (node: Node, child: Node) => void;
  appendChild: (node: Node, child: Node) => void;
  parentNode: (node: Node) => Node;
  nextSibling: (node: Node) => Node;
  tag: (elm: Element) => string;
  setTextContent: (node: Node, text: string | null) => void;
  getTextContent: (node: Node) => string | null;
  getAttribute: (elm: Element, attrName: string) => string;
  getProperty: (node: Node, propName: string) => string;
  getPropOrAttr: (elm: Element, propName: string) => any;
  setStyle: (elm: Element, styleName: string, styleValue: any) => void;
  isElement: (node: Node) => node is Element;
  isText: (node: Node) => node is Text;
  isComment: (node: Node) => node is Comment;
  nextTick: (cb: Function) => void;
  staticDir: string;
  hasCssLink(linkUrl: string): boolean;
  setCssLink(linkUrl: string): void;
  getDocumentHead(): HTMLHeadElement;
}