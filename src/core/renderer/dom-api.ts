import { DomApi } from '../../util/interfaces';


export function createDomApi(document: Document): DomApi {
  // using the $ prefix so that closure if
  // cool with property renaming each of these

  return {

    $head: document.head,

    $body: document.body,

    $isElement: function isElement(node: any) {
      return node.nodeType === 1;
    },

    $isText: function isText(node: any) {
      return node.nodeType === 3;
    },

    $isComment: function isComment(node: any) {
      return node.nodeType === 8;
    },

    $createEvent: function createEvent() {
      return document.createEvent('CustomEvent');
    },

    $createElement: function createElement(tagName: any, innerHTML?: string) {
      const elm = document.createElement(tagName);
      if (innerHTML) {
        elm.innerHTML = innerHTML;
      }
      return elm;
    },

    $createElementNS: function createElementNS(namespace: string, tagName: string) {
      return document.createElementNS(namespace, tagName);
    },

    $createTextNode: function createTextNode(text: string) {
      return document.createTextNode(text);
    },

    $createComment: function createComment(text: string) {
      return document.createComment(text);
    },

    $insertBefore: function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node) {
      parentNode.insertBefore(newNode, referenceNode);
    },

    $removeChild: function removeChild(node: Node, child: Node) {
      node.removeChild(child);
    },

    $appendChild: function appendChild(node: Node, child: Node) {
      node.appendChild(child);
    },

    $parentNode: function parentNode(node: Node) {
      return node.parentNode;
    },

    $nextSibling: function nextSibling(node: Node) {
      return node.nextSibling;
    },

    $tagName: function tagName(node: Element) {
      return node.tagName;
    },

    $getTextContent: function(node: any) {
      return node.textContent;
    },

    $setTextContent: function setTextContent(node: Node, text: string) {
      node.textContent = text;
    },

    $getAttribute: function getAttribute(node: Element, key: any) {
      return node.getAttribute(key);
    },

    $setAttribute: function setAttribute(node: Element, key: string, val: string) {
      node.setAttribute(key, val);
    },

    $setAttributeNS: function $setAttributeNS(node: Element, namespaceURI: string, qualifiedName: string, val: string) {
      node.setAttributeNS(namespaceURI, qualifiedName, val);
    },

    $removeAttribute: function removeAttribute(node: Element, key: string) {
      node.removeAttribute(key);
    }

  };

}
