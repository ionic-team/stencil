import { DomApi } from '../../util/interfaces';


export function createDomApi(document: Document): DomApi {
  // using the $ prefix so that closure if
  // cool with property renaming each of these

  return {

    $documentElement: document.documentElement,

    $head: document.head,

    $body: document.body,

    $nodeType: function nodeType(node: any) {
      return node.nodeType;
    },

    $createEvent: function createEvent() {
      return document.createEvent('CustomEvent');
    },

    $createElement: function createElement(tagName: any) {
      return document.createElement(tagName);
    },

    $createElementNS: function createElementNS(namespace: string, tagName: string) {
      return document.createElementNS(namespace, tagName);
    },

    $createTextNode: function createTextNode(text: string) {
      return document.createTextNode(text);
    },

    $createComment: function createComment(data: string) {
      return document.createComment(data);
    },

    $insertBefore: function insertBefore(parentNode: Node, childNode: Node, referenceNode: Node) {
      parentNode.insertBefore(childNode, referenceNode);
    },

    $removeChild: function removeChild(parentNode: Node, childNode: Node) {
      return parentNode.removeChild(childNode);
    },

    $appendChild: function appendChild(parentNode: Node, childNode: Node) {
      parentNode.appendChild(childNode);
    },

    $childNodes: function childNodes(node: Node) {
      return node.childNodes;
    },

    $parentNode: function parentNode(node: Node) {
      return node.parentNode;
    },

    $nextSibling: function nextSibling(node: Node) {
      return node.nextSibling;
    },

    $tagName: function tagName(elm: Element) {
      return elm.tagName;
    },

    $getTextContent: function(node: any) {
      return node.textContent;
    },

    $setTextContent: function setTextContent(node: Node, text: string) {
      node.textContent = text;
    },

    $getAttribute: function getAttribute(elm: Element, key: any) {
      return elm.getAttribute(key);
    },

    $setAttribute: function setAttribute(elm: Element, key: string, val: string) {
      elm.setAttribute(key, val);
    },

    $setAttributeNS: function $setAttributeNS(elm: Element, namespaceURI: string, qualifiedName: string, val: string) {
      elm.setAttributeNS(namespaceURI, qualifiedName, val);
    },

    $removeAttribute: function removeAttribute(elm: Element, key: string) {
      elm.removeAttribute(key);
    }

  };

}
