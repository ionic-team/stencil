'use strict';


module.exports = {

  parse: function parse(html) {
    var parse5 = require('parse5');
    return parse5.parse(html);
  },

  serialize: function serialize(node) {
    var parse5 = require('parse5');
    return parse5.serialize(node);
  },

  getElementsByTagName: function getElementsByTagName(node, tag) {
    var collectedElements = [];
    tag = tag.toLowerCase().trim();
    getElementsByTagNameRecursive(node, tag, collectedElements);
    return collectedElements;
  },

  getAttribute: function getAttribute(node, attrName) {
    if (node && node.attrs) {
      var attr = node.attrs.find(attr => attr.name === attrName)
      if (attr) {
        return attr.value;
      }
    }
    return null;
  },

  removeNode: function removeNode(node) {
    if (node && node.parentNode && node.parentNode.childNodes) {
      var index = node.parentNode.childNodes.indexOf(node);
      if (index > -1) {
        node.parentNode.childNodes.splice(index, 1);
        node.parentNode = null;
      }
    }
  },

  appendChild: function appendChild(parentNode, childNode) {
    if (parentNode && childNode && parentNode.childNodes) {
      childNode.parentNode = parentNode;
      parentNode.childNodes.push(childNode);
    }
  },

  createElement: function createElement(tag) {
    return {
      nodeName: tag,
      tagName: tag,
      attrs: [],
      namespaceURI: 'http://www.w3.org/1999/xhtml',
      childNodes: [],
      parentNode: null
    };
  },

  createText: function(content) {
    return {
      nodeName: '#text',
      value: content,
      parentNode: null
    };
  }

};


function getElementsByTagNameRecursive(node, tag, collectedElements) {
  if (node) {
    if (node.nodeName && node.nodeName.toLowerCase().trim() === tag) {
      collectedElements.push(node);
    }

    if (node.childNodes) {
      for (var i = 0; i < node.childNodes.length; i++) {
        getElementsByTagNameRecursive(node.childNodes[i], tag, collectedElements);
      }
    }
  }
}
