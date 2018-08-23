import { MockAttributeMap } from './attribute';
import { MockComment } from './comment-node';
import { MockElement, MockNode } from './node';
import { NODE_TYPES } from './constants';


export function serialize(elm: MockElement, opts: SerializeElementOptions = {}) {
  const output: SerializeOutput = {
    indent: 0,
    text: []
  };

  if (typeof opts.indentSpaces !== 'number') {
    opts.indentSpaces = 2;
  }

  if (typeof opts.newLines !== 'boolean') {
    opts.newLines = true;
  }

  if (typeof opts.newLines !== 'boolean') {
    opts.newLines = true;
  }

  if (typeof opts.excludeRoot !== 'boolean') {
    opts.excludeRoot = true;
  }

  if (opts.excludeRoot) {
    for (let i = 0; i < elm.childNodes.length; i++) {
      serializeToHtml(elm.childNodes[i], opts, output);
    }
  } else {
    serializeToHtml(elm, opts, output);
  }

  if (output.text[0] === '\n') {
    output.text.shift();
  }
  if (output.text[output.text.length - 1] === '\n') {
    output.text.pop();
  }

  return output.text.join('');
}


function serializeToHtml(node: MockNode, opts: SerializeElementOptions, output: SerializeOutput) {
  switch (node.nodeType) {
    case NODE_TYPES.ELEMENT_NODE:
      serializeElmentToHtml(node as MockElement, opts, output);
      break;

    case NODE_TYPES.TEXT_NODE:
      serializeTextNodeToHtml(node, opts, output);
      break;

    case NODE_TYPES.COMMENT_NODE:
      serializeCommentNodeToHtml(node as MockComment, opts, output);
      break;
  }
}


function serializeElmentToHtml(elm: MockElement, opts: SerializeElementOptions, output: SerializeOutput) {
  const tagName = elm.tagName.toLowerCase();

  const ignoreTag = (opts.excludeTags && opts.excludeTags.includes(tagName));

  if (!ignoreTag) {

    if (opts.newLines) {
      output.text.push('\n');
    }

    if (opts.indentSpaces > 0) {
      for (let i = 0; i < output.indent; i++) {
        output.text.push(' ');
      }
    }

    output.text.push('<');
    output.text.push(tagName);

    serializeAttributes(elm.attributes, output);

    const cssText = elm.style.cssText;
    if (cssText) {
      output.text.push(' style="', cssText, '"');
    }

    output.text.push('>');
  }

  if (!EMPTY_ELEMENTS[tagName]) {

    let childNodes: MockNode[];

    if (tagName === 'template') {
      childNodes = ((elm as any) as HTMLTemplateElement).content.childNodes as any;
    } else {
      childNodes = elm.childNodes;
    }

    if (childNodes.length > 0) {
      if (opts.indentSpaces > 0 && !ignoreTag) {
        output.indent = output.indent + opts.indentSpaces;
      }

      for (let i = 0; i < childNodes.length; i++) {
        serializeToHtml(childNodes[i], opts, output);
      }

      if (opts.newLines && !ignoreTag) {
        output.text.push('\n');
      }

      if (opts.indentSpaces > 0 && !ignoreTag) {
        output.indent = output.indent - opts.indentSpaces;

        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
      }
    }

    if (!ignoreTag) {
      output.text.push('</', tagName, '>');
    }
  }
}


function serializeAttributes(attrMap: MockAttributeMap, output: SerializeOutput) {
  for (let i = 0, attrsLength = attrMap.items.length; i < attrsLength; i++) {
    const attr = attrMap.items[i];

    if (attr.name === 'style') {
      continue;
    }

    output.text.push(' ');

    if (!attr.namespaceURI) {
      output.text.push(attr.name);

    } else if (attr.namespaceURI === 'http://www.w3.org/XML/1998/namespace') {
      output.text.push('xml:', attr.name);

    } else if (attr.namespaceURI === 'http://www.w3.org/2000/xmlns/') {
      if (attr.name !== 'xmlns') {
        output.text.push('xmlns:', attr.name);
      }

      output.text.push(attr.name);

    } else if (attr.namespaceURI === 'http://www.w3.org/1999/xlink') {
      output.text.push('xlink:', attr.name);

    } else {
      output.text.push(attr.namespaceURI, ':', attr.name);
    }

    output.text.push('="', escapeString(attr.value, true), '"');
  }
}

function serializeTextNodeToHtml(node: MockNode, opts: SerializeElementOptions, output: SerializeOutput) {
  if (node.nodeValue.trim() === '') {
    return;
  }

  if (opts.newLines) {
    output.text.push('\n');
  }

  if (opts.indentSpaces > 0) {
    for (let i = 0; i < output.indent; i++) {
      output.text.push(' ');
    }
  }

  const parentTagName = (node.parentNode && node.parentNode.nodeType === NODE_TYPES.ELEMENT_NODE ? node.parentNode.nodeName : null);

  if (NON_ESCAPABLE_CONTENT[parentTagName]) {
    output.text.push(node.nodeValue);

  } else {
    output.text.push(escapeString(node.nodeValue, false));
  }
}

function serializeCommentNodeToHtml(commentNode: MockComment, opts: SerializeElementOptions, output: SerializeOutput) {
  if (opts.newLines) {
    output.text.push('\n');
  }

  if (opts.indentSpaces > 0) {
    for (let i = 0; i < output.indent; i++) {
      output.text.push(' ');
    }
  }

  output.text.push('<!--', commentNode.nodeValue, '-->');
}

const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;

function escapeString(str: string, attrMode: boolean) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');

  if (attrMode) {
      str = str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  } else {
      str = str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
  }

  return str;
}


const NON_ESCAPABLE_CONTENT: {[tagName: string]: boolean} = {
  'style': true,
  'script': true,
  'xmp': true,
  'iframe': true,
  'noembed': true,
  'noframes': true,
  'plaintext': true,
  'noscript': true
};

const EMPTY_ELEMENTS: {[tagName: string]: boolean} = {
  'area': true,
  'base': true,
  'basefont': true,
  'bgsound': true,
  'br': true,
  'col': true,
  'embed': true,
  'frame': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'trace': true,
  'wbr': true
};

interface SerializeOutput {
  indent: number;
  text: string[];
}

export interface SerializeElementOptions {
  excludeRoot?: boolean;
  excludeTags?: string[];
  format?: 'html';
  indentSpaces?: number;
  newLines?: boolean;
}
