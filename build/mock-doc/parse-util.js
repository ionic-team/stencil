import { parse, parseFragment, } from 'parse5';
const docParser = new WeakMap();
export function parseDocumentUtil(ownerDocument, html) {
    const doc = parse(html.trim(), getParser(ownerDocument));
    doc.documentElement = doc.firstElementChild;
    doc.head = doc.documentElement.firstElementChild;
    doc.body = doc.head.nextElementSibling;
    return doc;
}
export function parseFragmentUtil(ownerDocument, html) {
    if (typeof html === 'string') {
        html = html.trim();
    }
    else {
        html = '';
    }
    const frag = parseFragment(html, getParser(ownerDocument));
    return frag;
}
function getParser(ownerDocument) {
    let parseOptions = docParser.get(ownerDocument);
    if (parseOptions != null) {
        return parseOptions;
    }
    const treeAdapter = {
        createDocument() {
            const doc = ownerDocument.createElement("#document" /* NODE_NAMES.DOCUMENT_NODE */);
            doc['x-mode'] = 'no-quirks';
            return doc;
        },
        setNodeSourceCodeLocation(node, location) {
            node.sourceCodeLocation = location;
        },
        getNodeSourceCodeLocation(node) {
            return node.sourceCodeLocation;
        },
        createDocumentFragment() {
            return ownerDocument.createDocumentFragment();
        },
        createElement(tagName, namespaceURI, attrs) {
            const elm = ownerDocument.createElementNS(namespaceURI, tagName);
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                if (attr.namespace == null || attr.namespace === 'http://www.w3.org/1999/xhtml') {
                    elm.setAttribute(attr.name, attr.value);
                }
                else {
                    elm.setAttributeNS(attr.namespace, attr.name, attr.value);
                }
            }
            return elm;
        },
        createCommentNode(data) {
            return ownerDocument.createComment(data);
        },
        appendChild(parentNode, newNode) {
            parentNode.appendChild(newNode);
        },
        insertBefore(parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        },
        setTemplateContent(templateElement, contentElement) {
            templateElement.content = contentElement;
        },
        getTemplateContent(templateElement) {
            return templateElement.content;
        },
        setDocumentType(doc, name, publicId, systemId) {
            let doctypeNode = doc.childNodes.find((n) => n.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */);
            if (doctypeNode == null) {
                doctypeNode = ownerDocument.createDocumentTypeNode();
                doc.insertBefore(doctypeNode, doc.firstChild);
            }
            doctypeNode.nodeValue = '!DOCTYPE';
            doctypeNode['x-name'] = name;
            doctypeNode['x-publicId'] = publicId;
            doctypeNode['x-systemId'] = systemId;
        },
        setDocumentMode(doc, mode) {
            doc['x-mode'] = mode;
        },
        getDocumentMode(doc) {
            return doc['x-mode'];
        },
        detachNode(node) {
            node.remove();
        },
        insertText(parentNode, text) {
            const lastChild = parentNode.lastChild;
            if (lastChild != null && lastChild.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
                lastChild.nodeValue += text;
            }
            else {
                parentNode.appendChild(ownerDocument.createTextNode(text));
            }
        },
        insertTextBefore(parentNode, text, referenceNode) {
            const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
            if (prevNode != null && prevNode.nodeType === 3 /* NODE_TYPES.TEXT_NODE */) {
                prevNode.nodeValue += text;
            }
            else {
                parentNode.insertBefore(ownerDocument.createTextNode(text), referenceNode);
            }
        },
        adoptAttributes(recipient, attrs) {
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                if (recipient.hasAttributeNS(attr.namespace, attr.name) === false) {
                    recipient.setAttributeNS(attr.namespace, attr.name, attr.value);
                }
            }
        },
        getFirstChild(node) {
            return node.childNodes[0];
        },
        getChildNodes(node) {
            return node.childNodes;
        },
        getParentNode(node) {
            return node.parentNode;
        },
        getAttrList(element) {
            const attrs = element.attributes.__items.map((attr) => {
                return {
                    name: attr.name,
                    value: attr.value,
                    namespace: attr.namespaceURI,
                    prefix: null,
                };
            });
            return attrs;
        },
        getTagName(element) {
            if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
                return element.nodeName.toLowerCase();
            }
            else {
                return element.nodeName;
            }
        },
        getNamespaceURI(element) {
            // mock-doc widens the type of an element's namespace uri to 'string | null'
            // we use a type assertion here to adhere to parse5's type definitions
            return element.namespaceURI;
        },
        getTextNodeContent(textNode) {
            return textNode.nodeValue;
        },
        getCommentNodeContent(commentNode) {
            return commentNode.nodeValue;
        },
        getDocumentTypeNodeName(doctypeNode) {
            return doctypeNode['x-name'];
        },
        getDocumentTypeNodePublicId(doctypeNode) {
            return doctypeNode['x-publicId'];
        },
        getDocumentTypeNodeSystemId(doctypeNode) {
            return doctypeNode['x-systemId'];
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['text']`. As a result, we cannot
        // complete this function signature
        isTextNode(node) {
            return node.nodeType === 3 /* NODE_TYPES.TEXT_NODE */;
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['comment']`. As a result, we cannot
        // complete this function signature (which requires its return type to be a type predicate)
        isCommentNode(node) {
            return node.nodeType === 8 /* NODE_TYPES.COMMENT_NODE */;
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['document']`. As a result, we cannot
        // complete this function signature (which requires its return type to be a type predicate)
        isDocumentTypeNode(node) {
            return node.nodeType === 10 /* NODE_TYPES.DOCUMENT_TYPE_NODE */;
        },
        // @ts-ignore - a `MockNode` will never be assignable to a `TreeAdapterTypeMap['element']`. As a result, we cannot
        // complete this function signature (which requires its return type to be a type predicate)
        isElementNode(node) {
            return node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */;
        },
    };
    parseOptions = {
        treeAdapter: treeAdapter,
    };
    docParser.set(ownerDocument, parseOptions);
    return parseOptions;
}
//# sourceMappingURL=parse-util.js.map