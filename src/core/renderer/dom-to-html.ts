import * as parse5 from 'parse5';

const domAdapter = {

  // Tree traversing
  getFirstChild : function (node: Node) {
    return node.childNodes[0];
  },

  getChildNodes : function (node: Node) {
    return node.childNodes;
  },

  getParentNode : function (node: Node) {
    return node.parentNode;
  },

  getAttrList : function (node: Node) {
    return node.attributes;
  },

  // Node data
  getTagName : function (element: Element) {
    return element.tagName.toLowerCase();
  },

  getNamespaceURI : function (element: Element) {
    return element.namespaceURI || 'http://www.w3.org/1999/xhtml';
  },

  getTemplateContent : function (node: HTMLTemplateElement) {
    return node.content;
  },

  getTextNodeContent : function (textNode: Node) {
    return textNode.nodeValue;
  },

  getCommentNodeContent : function (commentNode: Node) {
    return commentNode.nodeValue;
  },

  getDocumentTypeNodeName : function (doctypeNode: DocumentType) {
    return doctypeNode.name;
  },

  getDocumentTypeNodePublicId : function (doctypeNode: DocumentType) {
    return doctypeNode.publicId || null;
  },

  getDocumentTypeNodeSystemId : function (doctypeNode: DocumentType) {
    return doctypeNode.systemId || null;
  },

  // Node types
  isTextNode : function (node: Node) {
    return node.nodeName === '#text';
  },

  isCommentNode : function (node: Node) {
    return node.nodeName === '#comment';
  },

  isDocumentTypeNode : function (node: Node) {
    return node.nodeType === 10;
  },

  isElementNode : function (node: any) {
    return Boolean(node.tagName);
  },

};


export function domToHtml(node: any) {
  if (node.nodeType === 9 /* DOCUMENT_NODE */) {
    return parse5.serialize(node, {
      treeAdapter: <any>domAdapter
    });
  }

  return parse5.serialize({ childNodes: [node] }, {
    treeAdapter: <any>domAdapter
  });
}
