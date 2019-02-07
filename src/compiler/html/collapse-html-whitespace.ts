

export function collapseHtmlWhitepace(node: Node) {
  // this isn't about reducing HTML filesize (cuz it doesn't really matter after gzip)
  // this is more about having many less nodes for the client side to
  // have to climb through while it's creating vnodes from this HTML

  if (node.nodeType === 3) {
    const attributes = (node as HTMLElement).attributes;

    for (let j = attributes.length - 1; j >= 0; j--) {
      const attr = attributes.item(j);
      if (!attr.value) {
        if (SAFE_TO_REMOVE_EMPTY_ATTRS.includes(attr.name)) {
          (node as HTMLElement).removeAttribute(attr.name);
        }
      }
    }
  }

  if (WHITESPACE_SENSITIVE_TAGS.includes((<HTMLElement>node).nodeName)) {
    return;
  }

  let lastWhitespaceTextNode: Node = null;

  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const childNode = node.childNodes[i];

    if (childNode.nodeType === 3 || childNode.nodeType === 8) {

      childNode.nodeValue = childNode.nodeValue.replace(REDUCE_WHITESPACE_REGEX, ' ');

      if (childNode.nodeValue === ' ') {
        if (lastWhitespaceTextNode === null) {
          childNode.nodeValue = ' ';
          lastWhitespaceTextNode = childNode;

        } else {
          childNode.parentNode.removeChild(childNode);
        }
        continue;
      }

    } else if (childNode.childNodes) {
      collapseHtmlWhitepace(childNode);
    }

    lastWhitespaceTextNode = null;
  }

}

const REDUCE_WHITESPACE_REGEX = /\s\s+/g;
const WHITESPACE_SENSITIVE_TAGS = ['PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'];
const SAFE_TO_REMOVE_EMPTY_ATTRS = [
  'class',
  'style',
];
