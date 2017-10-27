import { DomApi } from '../../util/interfaces';
import { toLowerCase } from '../../util/helpers';


export function createDomApi(document: Document): DomApi {
  // using the $ prefix so that closure is
  // cool with property renaming each of these

  return {

    $documentElement: document.documentElement,

    $head: document.head,

    $body: document.body,

    $nodeType: (node: any) => node.nodeType,

    $createEvent: () => document.createEvent('CustomEvent'),

    $createElement: (tagName: any) => document.createElement(tagName),

    $createElementNS: (namespace: string, tagName: string) => document.createElementNS(namespace, tagName),

    $createTextNode: (text: string) => document.createTextNode(text),

    $createComment: (data: string) => document.createComment(data),

    $insertBefore: (parentNode: Node, childNode: Node, referenceNode: Node) => parentNode.insertBefore(childNode, referenceNode),

    $removeChild: (parentNode: Node, childNode: Node) => parentNode.removeChild(childNode),

    $appendChild: (parentNode: Node, childNode: Node) => parentNode.appendChild(childNode),

    $childNodes: (node: Node) => node.childNodes,

    $parentNode: (node: Node) => node.parentNode,

    $nextSibling: (node: Node) => node.nextSibling,

    $tagName: (elm: Element) => toLowerCase(elm.tagName),

    $getTextContent: (node: any) => node.textContent,

    $setTextContent: (node: Node, text: string) => node.textContent = text,

    $getAttribute: (elm: Element, key: any) => elm.getAttribute(key),

    $setAttribute: (elm: Element, key: string, val: string) => elm.setAttribute(key, val),

    $setAttributeNS: (elm: Element, namespaceURI: string, qualifiedName: string, val: string) => elm.setAttributeNS(namespaceURI, qualifiedName, val),

    $removeAttribute: (elm: Element, key: string) => elm.removeAttribute(key)

  };

}
