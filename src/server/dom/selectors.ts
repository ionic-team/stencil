import { Node } from './node';

// cheezy, look into sizzle later on
// https://github.com/jquery/sizzle

export function querySelector(node: Node, selectors: Selector[]): Node {
  if (node) {
    if (isMatch(node, selectors)) {
      return node;
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        var childNodeById = querySelector(node.children[i], selectors);
        if (childNodeById !== null) {
          return childNodeById;
        }
      }
    }
  }
  return null;
}


export function querySelectorAll(foundNodes: Node[], node: Node, selectors: Selector[]) {
  if (node) {
    if (isMatch(node, selectors)) {
      foundNodes.push(node);
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        querySelectorAll(foundNodes, node.children[i], selectors);
      }
    }
  }
}


export function createSelectors(selector: string) {
  if (typeof selector !== 'string') return [];

  selector = selector.trim();

  return selector.split(',').map(s => {
    const selector: Selector = {};

    if (s.charAt(0) === '#') {
      selector.id = s.substr(1).trim();
    } else if (s.charAt(0) === '.') {
      selector.className = s.substr(1).trim();
    } else {
      selector.tagName = s.toLowerCase().trim();
    }

    return selector;
  });
}

export interface Selector {
  id?: string;
  className?: string;
  tagName?: string;
}


export function isMatch(node: Node, selectors: Selector[]) {
  if (node) {
    for (var i = 0; i < selectors.length; i++) {
      var selector = selectors[i];

      if (selector.tagName && node.tagName && node.tagName.toLowerCase() === selector.tagName) {
        return true;
      }

      if (node.attribs) {
        if (selector.id && node.attribs['id'] === selector.id) {
          return true;
        }
        if (selector.className && node.attribs['class'] && node.classList.contains(selector.className)) {
          return true;
        }
      }

    }
  }
  return false;
}


export function getElementById(node: Node, id: string): Node {
  if (node) {
    if (node.attribs && node.attribs[id] === id) {
      return node;
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        var childNodeById = getElementById(node.children[i], id);
        if (childNodeById !== null) {
          return childNodeById;
        }
      }
    }
  }
  return null;
}


export function getElementsByTagName(foundNodes: Node[], node: Node, tagName: string) {
  if (node) {
    if (node.tagName && node.tagName.toLowerCase() === tagName) {
      foundNodes.push(node);
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        getElementsByTagName(foundNodes, node.children[i], tagName);
      }
    }
  }
}


export function getElementsByClassName(foundNodes: Node[], node: Node, className: string) {
  if (node) {
    if (node.attribs && node.classList.contains(className)) {
      foundNodes.push(node);
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        getElementsByClassName(foundNodes, node.children[i], className);
      }
    }
  }
}


export function getElementsName(foundNodes: Node[], node: Node, attrName: string) {
  if (node) {
    if (node.hasAttribute(attrName)) {
      foundNodes.push(node);
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        getElementsName(foundNodes, node.children[i], attrName);
      }
    }
  }
}


export function hasChildNodes(node: Node) {
  return !!(node && node.childNodes && node.childNodes.length);
}


const COMMON_ATTRS: any = {
  'class': true,
  'id': true
};

export function getAllSelectors(node: Node, selectors: {[selector: string]: boolean}) {
  if (node) {
    if (node.attribs) {
      selectors[node.tagName] = true;

      Object.keys(node.attribs).forEach(attrName => {
        if (!COMMON_ATTRS[attrName]) {
          selectors[`[${attrName.trim()}]`] = true;
        }
      });

      node.className.split(' ').forEach(c => {
        const className = '.' + c.trim();

        if (className.length > 1) {
          selectors[className] = true;
        }
      });
    }

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        getAllSelectors(node.children[i], selectors);
      }
    }
  }
}
