import { Node } from './node';
import * as parse5 from 'parse5';


// Node construction
function createDocument() {
  const node = new Node();
  node.type = 'root';
  node.name = 'root';
  node.parent = null;
  node.prev = null;
  node.next = null;
  node.children = [];
  node['x-mode'] = 'no-quirks';
  return node;
}

function createDocumentFragment() {
  const node = new Node();
  node.type = 'root';
  node.name = 'root';
  node.parent = null;
  node.prev = null;
  node.next = null;
  node.children = [];
  return node;
}

export function createElement(tagName: string, namespaceURI: string, attrs: Attribute[]) {
  var attribs = Object.create(null),
      attribsNamespace = Object.create(null),
      attribsPrefix = Object.create(null);

  for (var i = 0; i < attrs.length; i++) {
    var attrName = attrs[i].name;

    attribs[attrName] = attrs[i].value;
    attribsNamespace[attrName] = attrs[i].namespace;
    attribsPrefix[attrName] = attrs[i].prefix;
  }

  const node = new Node();
  node.type = tagName === 'script' || tagName === 'style' ? tagName : 'tag';
  node.name = tagName;
  node.namespace = namespaceURI;
  node.attribs = attribs;
  node['x-attribsNamespace'] = attribsNamespace;
  node['x-attribsPrefix'] = attribsPrefix;
  node.children = [];
  node.parent = null;
  node.prev = null;
  node.next = null;
  return node;
}

export function createCommentNode(data: string) {
  const node = new Node();
  node.type = 'comment';
  node.data = data;
  node.parent = null;
  node.prev = null;
  node.next = null;
  return node;
}

export function createTextNode(value: string) {
  const node = new Node();
  node.type = 'text';
  node.data = value;
  node.parent = null;
  node.prev = null;
  node.next = null;
  return node;
}


// Tree mutation
export function appendChild(parentNode: Node, newNode: Node) {
  var prev = parentNode.children[parentNode.children.length - 1];

  if (prev) {
    prev.next = newNode;
    newNode.prev = prev;
  }

  parentNode.children.push(newNode);
  newNode.parent = parentNode;
}

function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node) {
  var insertionIdx = parentNode.children.indexOf(referenceNode);
  var prev = referenceNode && referenceNode.prev || null;

  if (prev) {
    prev.next = newNode;
    newNode.prev = prev;
  }

  if (referenceNode) {
    referenceNode.prev = newNode;
  }

  newNode.next = referenceNode;

  if (insertionIdx > -1) {
    parentNode.children.splice(insertionIdx, 0, newNode);
  } else {
    parentNode.children.push(newNode);
  }

  newNode.parent = parentNode;
}

function setTemplateContent(templateElement: Node, contentElement: Node) {
  appendChild(templateElement, contentElement);
}

function getTemplateContent(templateElement: Node) {
  return templateElement.children[0];
}

function setDocumentType(document: any, name: string, publicId: string, systemId: string) {
  var data = serializeContent(name, publicId, systemId);
  var doctypeNode: Node = null;

  for (var i = 0; i < document.children.length; i++) {
    if (document.children[i].type === 'directive' && document.children[i].name === '!doctype') {
      doctypeNode = document.children[i];
      break;
    }
  }

  if (doctypeNode) {
    doctypeNode.data = data;
    doctypeNode['x-name'] = name;
    doctypeNode['x-publicId'] = publicId;
    doctypeNode['x-systemId'] = systemId;

  } else {
    var node = new Node();
    node.type = 'directive';
    node.name = '!doctype';
    node.data = data;
    node['x-name'] = name;
    node['x-publicId'] = publicId;
    node['x-systemId'] = systemId;
    appendChild(document, node);
  }
}

function setDocumentMode(document: any, mode: string) {
  document['x-mode'] = mode;
}

function getDocumentMode(document: any) {
  return document['x-mode'];
}

function detachNode(node: Node) {
  if (node.parent) {
    var idx = node.parent.children.indexOf(node),
        prev = node.prev,
        next = node.next;

    node.prev = null;
    node.next = null;

    if (prev)
      prev.next = next;

    if (next)
      next.prev = prev;

    node.parent.children.splice(idx, 1);
    node.parent = null;
  }
}

export function insertText(parentNode: Node, text: string) {
  var lastChild = parentNode.children[parentNode.children.length - 1];

  if (lastChild && lastChild.type === 'text')
    lastChild.data += text;
  else
    appendChild(parentNode, createTextNode(text));
}

function insertTextBefore(parentNode: Node, text: string, referenceNode: Node) {
  var prevNode = parentNode.children[parentNode.children.indexOf(referenceNode) - 1];

  if (prevNode && prevNode.type === 'text')
      prevNode.data += text;
  else
      insertBefore(parentNode, createTextNode(text), referenceNode);
}

function adoptAttributes(recipient: Node, attrs: Attribute[]) {
    for (var i = 0; i < attrs.length; i++) {
        var attrName = attrs[i].name;

        if (typeof recipient.attribs[attrName] === 'undefined') {
            recipient.attribs[attrName] = attrs[i].value;
            recipient['x-attribsNamespace'][attrName] = attrs[i].namespace;
            recipient['x-attribsPrefix'][attrName] = attrs[i].prefix;
        }
    }
}


// Tree traversing
function getFirstChild(node: Node) {
  return node.children[0];
}

function getChildNodes(node: Node) {
  return node.children;
}

function getParentNode(node: Node) {
  return node.parent;
}

function getAttrList(element: Node) {
  var attrList = [];

  for (var name in element.attribs) {
    attrList.push({
      name: name,
      value: element.attribs[name],
      namespace: element['x-attribsNamespace'][name],
      prefix: element['x-attribsPrefix'][name]
    });
  }

  return attrList;
}


// Node data
function getTagName(element: Node) {
  return element.name;
}

function getNamespaceURI(element: Node) {
  return element.namespace;
}

function getTextNodeContent(textNode: Node) {
    return textNode.data;
}

function getCommentNodeContent(commentNode: Node) {
  return commentNode.data;
}

function getDocumentTypeNodeName(doctypeNode: Node) {
  return doctypeNode['x-name'];
}

function getDocumentTypeNodePublicId(doctypeNode: Node) {
  return doctypeNode['x-publicId'];
}

function getDocumentTypeNodeSystemId(doctypeNode: Node) {
  return doctypeNode['x-systemId'];
}


// Node types
function isTextNode(node: Node) {
  return node.type === 'text';
}

function isCommentNode(node: Node) {
  return node.type === 'comment';
}

function isDocumentTypeNode(node: Node) {
  return node.type === 'directive' && node.name === '!doctype';
}

function isElementNode(node: Node) {
  return !!node.attribs;
}

export interface Attribute {
  /**
   * The name of the attribute.
   */
  name: string;
  /**
   * The value of the attribute.
   */
  value: string;
  /**
   * The namespace of the attribute.
   */
  namespace?: string;
  /**
   * The namespace-related prefix of the attribute.
   */
  prefix?: string;
}


function serializeContent(name: string, publicId: string, systemId: string) {
  var str = '!DOCTYPE ';

  if (name)
      str += name;

  if (publicId !== null)
      str += ' PUBLIC ' + enquoteDoctypeId(publicId);

  else if (systemId !== null)
      str += ' SYSTEM';

  if (systemId !== null)
      str += ' ' + enquoteDoctypeId(systemId);

  return str;
}

function enquoteDoctypeId(id: string) {
  var quote = id.indexOf('"') !== -1 ? '\'' : '"';

  return quote + id + quote;
}


export const adapter: parse5.AST.TreeAdapter = {
  createDocument,
  createDocumentFragment,
  createElement,
  createCommentNode,
  appendChild,
  insertBefore,
  setTemplateContent,
  getTemplateContent,
  setDocumentType,
  setDocumentMode,
  getDocumentMode,
  detachNode,
  insertText,
  insertTextBefore,
  adoptAttributes,
  getFirstChild,
  getChildNodes,
  getParentNode,
  getAttrList,
  getTagName,
  getNamespaceURI,
  getTextNodeContent,
  getCommentNodeContent,
  getDocumentTypeNodeName,
  getDocumentTypeNodePublicId,
  getDocumentTypeNodeSystemId,
  isTextNode,
  isCommentNode,
  isDocumentTypeNode,
  isElementNode,
};
