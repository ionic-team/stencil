import { MockComment } from './comment-node';
import { MockDocument } from './document';
import { MockElement, MockNode } from './node';
import { MockTextNode } from './text-node';
import { NODE_TYPES } from './constants';
import * as parse5 from 'parse5';


export function parseDocumentUtil(ownerDocument: any, html: string) {
  const doc = parse5.parse(
    html.trim(),
    getParser(ownerDocument)
  ) as any;

  doc.documentElement = doc.firstElementChild;
  doc.head = doc.documentElement.firstElementChild;
  doc.body = doc.head.nextElementSibling;

  return doc;
}


export function parseFragmentUtil(ownerDocument: any, html: string) {
  const frag = parse5.parseFragment(
    html.trim(),
    getParser(ownerDocument)
  ) as any;

  return frag;
}


function getParser(ownerDocument: any) {
  if (ownerDocument._parser) {
    return ownerDocument._parser;
  }

  const treeAdapter: parse5.TreeAdapter = {

    createDocument() {
      const doc = ownerDocument.createElement('#document');
      (doc as any)['x-mode'] = 'no-quirks';
      return doc;
    },

    createDocumentFragment() {
      return ownerDocument.createDocumentFragment();
    },

    createElement(tagName: string, namespaceURI: string, attrs: parse5.Attribute[]) {
      const elm = ownerDocument.createElement(tagName);
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
    },

    createCommentNode(data: string) {
      return ownerDocument.createComment(data);
    },

    appendChild(parentNode: MockNode, newNode: MockNode) {
      parentNode.appendChild(newNode);
    },

    insertBefore(parentNode: MockNode, newNode: MockNode, referenceNode: MockNode) {
      parentNode.insertBefore(newNode, referenceNode);
    },

    setTemplateContent(templateElement: MockElement, contentElement: MockElement) {
      templateElement.appendChild(contentElement);
    },

    getTemplateContent(templateElement: MockElement) {
      return templateElement.children[0];
    },

    setDocumentType(doc: MockDocument, name: string, publicId: string, systemId: string) {
      let doctypeNode = doc.childNodes.find(n => n.nodeType === NODE_TYPES.DOCUMENT_TYPE_NODE);

      if (!doctypeNode) {
        doctypeNode = ownerDocument.createDocumentTypeNode();
        doc.insertBefore(doctypeNode, doc.firstChild);
      }

      doctypeNode.nodeValue = '!DOCTYPE';
      (doctypeNode as any)['x-name'] = name;
      (doctypeNode as any)['x-publicId'] = publicId;
      (doctypeNode as any)['x-systemId'] = systemId;
    },

    setDocumentMode(doc: any, mode: string) {
      doc['x-mode'] = mode;
    },

    getDocumentMode(doc: any) {
      return doc['x-mode'];
    },

    detachNode(node: MockNode) {
      node.remove();
    },

    insertText(parentNode: MockNode, text: string) {
      const lastChild = parentNode.lastChild;

      if (lastChild && lastChild.nodeType === NODE_TYPES.TEXT_NODE) {
        lastChild.nodeValue += text;
      } else {

        parentNode.appendChild(ownerDocument.createTextNode(text));
      }
    },

    insertTextBefore(parentNode: MockNode, text: string, referenceNode: MockNode) {
      const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];

      if (prevNode && prevNode.nodeType === NODE_TYPES.TEXT_NODE) {
        prevNode.nodeValue += text;
      } else {
        parentNode.insertBefore(ownerDocument.createTextNode(text), referenceNode);
      }
    },

    adoptAttributes(recipient: MockElement, attrs: parse5.Attribute[]) {
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];

        if (!recipient.hasAttributeNS(attr.namespace, attr.name)) {
          recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
        }
      }
    },

    getFirstChild(node: MockNode) {
      return node.childNodes[0];
    },

    getChildNodes(node: MockNode) {
      return node.childNodes;
    },

    getParentNode(node: MockNode) {
      return node.parentNode;
    },

    getAttrList(element: MockElement) {
      const attrs: parse5.Attribute[] = element.attributes.items.map(attr => {
        return {
          name: attr.name,
          value: attr.value,
          namespace: attr.namespaceURI,
          prefix: null
        };
      });
      return attrs;
    },

    getTagName(element: MockElement) {
      return element.nodeName.toLowerCase();
    },

    getNamespaceURI(element: MockElement) {
      return element.namespaceURI;
    },

    getTextNodeContent(textNode: MockTextNode) {
      return textNode.nodeValue;
    },

    getCommentNodeContent(commentNode: MockComment) {
      return commentNode.nodeValue;
    },

    getDocumentTypeNodeName(doctypeNode: any) {
      return doctypeNode['x-name'];
    },

    getDocumentTypeNodePublicId(doctypeNode: any) {
      return doctypeNode['x-publicId'];
    },

    getDocumentTypeNodeSystemId(doctypeNode: any) {
      return doctypeNode['x-systemId'];
    },

    isTextNode(node: MockNode) {
      return node.nodeType === NODE_TYPES.TEXT_NODE;
    },

    isCommentNode(node: MockNode) {
      return node.nodeType === NODE_TYPES.COMMENT_NODE;
    },

    isDocumentTypeNode(node: MockNode) {
      return node.nodeType === NODE_TYPES.DOCUMENT_TYPE_NODE;
    },

    isElementNode(node: MockNode) {
      return node.nodeType === NODE_TYPES.ELEMENT_NODE;
    }
  };

  const parseOptions: parse5.ParserOptions = {
    treeAdapter: treeAdapter
  };

  ownerDocument._parser = parseOptions;

  return parseOptions;
}
