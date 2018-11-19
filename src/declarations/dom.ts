

export interface DomApi {
  $doc: HTMLDocument;
  $nodeType(node: any): number;
  $createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  $createElement(tagName: any): HTMLElement;
  $createElementNS(namespace: string, tagName: any): any;
  $createTextNode(text: string): Text;
  $createComment(data: string): Comment;
  $insertBefore(parentNode: Node, childNode: Node, referenceNode: Node): void;
  $remove(node: Node): Node;
  $appendChild(parentNode: Node, childNode: Node): void;
  $addClass(elm: any, cssClass: string): void;
  $childNodes(node: Node): NodeList;
  $parentNode(node: Node): Node;
  $previousSibling(node: Node): Node;
  $nextSibling(node: Node): Node;
  $tagName(elm: any): string;
  $getTextContent(node: any): string;
  $setTextContent(node: Node, text: string): void;
  $getAttribute(elm: any, key: string): string;
  $getMode?(elm: any): string;
  $setAttribute(elm: any, key: string, val: any): void;
  $setAttributeNS?(elm: any, namespaceURI: string, qualifiedName: string, value: string): void;
  $removeAttribute(elm: any, key: string): void;
  $hasAttribute(elm: any, key: string): boolean;
  $elementRef?(elm: any, referenceName: string): any;
  $parentElement?(node: Node): any;
  $addEventListener?(elm: any, eventName: string, eventListener: any, useCapture?: boolean, usePassive?: boolean, attachTo?: string|Element): void;
  $removeEventListener?(elm: any, eventName?: string): any;
  $dispatchEvent?(elm: Element | Document | Window, eventName: string, data: any): CustomEvent;
  $supportsShadowDom?: boolean;
  $supportsEventOptions?: boolean;
  $attachShadow?(elm: any, shadowRootInitDict: ShadowRootInit): any;
}
