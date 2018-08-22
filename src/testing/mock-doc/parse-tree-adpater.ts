import { MockComment } from './comment-node';
import { MockDocument } from './document';
import { MockDocumentFragment } from './document-fragment';
import { MockElement, MockNode } from './node';
import { MockTextNode } from './text-node';
import { Attribute, TreeAdapter } from 'parse5';


// Node construction
function createDocument() {
  const doc = new MockElement(null, '#document');
  (doc as any)['x-mode'] = 'no-quirks';
  return doc;
}

function createDocumentFragment() {
  const docFrag = new MockDocumentFragment(null);
  return docFrag;
}

function createElement(tagName: string, namespaceURI: string, attrs: Attribute[]) {
  const elm = new MockElement(null, tagName);
  elm.namespaceURI = namespaceURI;

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];

    if (attr.namespace == null || attr.namespace === 'http://www.w3.org/1999/xhtml') {
      elm.setAttribute(attr.name, attr.value);
    } else {
      elm.setAttributeNS(attr.namespace, attr.name, attr.value);
    }
  }

  return elm;
}

function createCommentNode(data: string) {
  return new MockComment(null, data);
}

function createTextNode(text: string) {
  return new MockTextNode(null, text);
}

// Tree mutation
function appendChild(parentNode: MockNode, newNode: MockNode) {
  parentNode.appendChild(newNode);
}

function insertBefore(parentNode: MockNode, newNode: MockNode, referenceNode: MockNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function setTemplateContent(templateElement: MockElement, contentElement: MockElement) {
  appendChild(templateElement, contentElement);
}

function getTemplateContent(templateElement: MockElement) {
  return templateElement.children[0];
}

function setDocumentType(doc: MockDocument, name: string, publicId: string, systemId: string) {
  let doctypeNode = doc.childNodes.find(n => n.nodeType === MockNode.DOCUMENT_TYPE_NODE);

  if (!doctypeNode) {
    doctypeNode = new MockNode(doc);
    doctypeNode.nodeType = MockNode.DOCUMENT_TYPE_NODE;
    doc.insertBefore(doctypeNode, doc.firstChild);
  }

  doctypeNode.nodeValue = '!DOCTYPE';
  (doctypeNode as any)['x-name'] = name;
  (doctypeNode as any)['x-publicId'] = publicId;
  (doctypeNode as any)['x-systemId'] = systemId;
}

function setDocumentMode(doc: any, mode: string) {
  doc['x-mode'] = mode;
}

function getDocumentMode(doc: any) {
  return doc['x-mode'];
}

function detachNode(node: MockNode) {
  node.remove();
}

function insertText(parentNode: MockNode, text: string) {
  const lastChild = parentNode.lastChild;

  if (lastChild && lastChild.nodeType === MockNode.TEXT_NODE) {
    lastChild.nodeValue += text;
  } else {
    appendChild(parentNode, createTextNode(text));
  }
}

function insertTextBefore(parentNode: MockNode, text: string, referenceNode: MockNode) {
  const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

  if (prevNode && prevNode.nodeType === MockNode.TEXT_NODE) {
    prevNode.nodeValue += text;
  } else {
    insertBefore(parentNode, createTextNode(text), referenceNode);
  }
}

function adoptAttributes(recipient: MockElement, attrs: Attribute[]) {
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];

    if (!recipient.hasAttributeNS(attr.namespace, attr.name)) {
      recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
    }
  }
}

// Tree traversing
function getFirstChild(node: MockNode) {
  return node.childNodes[0];
}

function getChildNodes(node: MockNode) {
  return node.childNodes;
}

function getParentNode(node: MockNode) {
  return node.parentNode;
}

function getAttrList(element: MockElement) {
  const attrs: Attribute[] = element.attributes.items.map(attr => {
    return {
      name: attr.name,
      value: attr.value,
      namespace: attr.namespaceURI,
      prefix: null
    };
  });
  return attrs;
}

// Node data
function getTagName(element: MockElement) {
  return element.nodeName.toLowerCase();
}

function getNamespaceURI(element: MockElement) {
  return element.namespaceURI;
}

function getTextNodeContent(textNode: MockTextNode) {
  return textNode.nodeValue;
}

function getCommentNodeContent(commentNode: MockComment) {
  return commentNode.nodeValue;
}

function getDocumentTypeNodeName(doctypeNode: any) {
  return doctypeNode['x-name'];
}

function getDocumentTypeNodePublicId(doctypeNode: any) {
  return doctypeNode['x-publicId'];
}

function getDocumentTypeNodeSystemId(doctypeNode: any) {
  return doctypeNode['x-systemId'];
}

// Node types
function isTextNode(node: MockNode) {
  return node.nodeType === MockNode.TEXT_NODE;
}

function isCommentNode(node: MockNode) {
  return node.nodeType === MockNode.COMMENT_NODE;
}

function isDocumentTypeNode(node: MockNode) {
  return node.nodeType === MockNode.DOCUMENT_TYPE_NODE;
}

function isElementNode(node: MockNode) {
  return node.nodeType === MockNode.ELEMENT_NODE;
}

export const treeAdapter: TreeAdapter = {
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
  isElementNode
};
