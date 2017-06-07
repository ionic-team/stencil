
export const domAdapter = {

  // Tree traversing
  getFirstChild : function (node) {
    return node.childNodes[0];
  },

  getChildNodes : function (node) {
    return node.childNodes;
  },

  getParentNode : function (node) {
    return node.parentNode;
  },

  getAttrList : function (node) {
    return node.attributes;
  },

  // Node data
  getTagName : function (element) {
    return element.tagName.toLowerCase();
  },

  getNamespaceURI : function (element) {
    return element.namespaceURI || "http://www.w3.org/1999/xhtml";
  },

  getTemplateContent : function (node) {
    return node.content;
  },

  getTextNodeContent : function (textNode) {
    return textNode.nodeValue;
  },

  getCommentNodeContent : function (commentNode) {
    return commentNode.nodeValue;
  },

  getDocumentTypeNodeName : function (doctypeNode) {
    return doctypeNode.name;
  },

  getDocumentTypeNodePublicId : function (doctypeNode) {
    return doctypeNode.publicId || null;
  },

  getDocumentTypeNodeSystemId : function (doctypeNode) {
    return doctypeNode.systemId || null;
  },

  // Node types
  isTextNode : function (node) {
    return node.nodeName === "#text";
  },

  isCommentNode : function (node) {
    return node.nodeName === "#comment";
  },

  isDocumentTypeNode : function (node) {
    return node.nodeType === 10;
  },

  isElementNode : function (node) {
    return Boolean(node.tagName);
  },


};
