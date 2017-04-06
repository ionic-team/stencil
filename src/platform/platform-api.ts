import { ComponentMeta, ComponentMode, DomRead, DomWrite, NextTick } from '../util/interfaces';


export interface PlatformApi {
  registerComponent: (cmpMeta: ComponentMeta) => void;
  getComponentMeta: (tag: string) => ComponentMeta;
  loadComponent: (cmpMeta: ComponentMeta, cmpMode: ComponentMode, cb: Function) => void;
  nextTick: NextTick;
  domRead: DomRead;
  domWrite: DomWrite;

  isElement: (node: Node) => node is Element;
  isText: (node: Node) => node is Text;
  isComment: (node: Node) => node is Comment;

  $createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  $createElementNS: (namespaceURI: string, qualifiedName: string) => Element;
  $createTextNode: (text: string) => Text;
  $createComment: (text: string) => Comment;
  $insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
  $removeChild: (parentNode: Node, childNode: Node) => void;
  $appendChild: (parentNode: Node, childNode: Node) => void;
  $parentNode: (node: Node) => Node;
  $nextSibling: (node: Node) => Node;
  $tagName: (elm: Element) => string;
  $setTextContent: (node: Node, text: string | null) => void;
  $getTextContent: (node: Node) => string | null;
  $getAttribute: (elm: Element, attrName: string) => string;
  $attachShadow: (elm: Element, cmpMode: ComponentMode, cmpModeId: string) => ShadowRoot;
}
