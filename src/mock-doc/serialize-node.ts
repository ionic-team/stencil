import { MockAttributeMap } from './attribute';
import { MockComment } from './comment-node';
import { MockElement, MockNode } from './node';
import { NODE_TYPES } from './constants';


export function serializeNodeToHtml(elm: MockElement, opts: SerializeElementOptions = {}) {
  const output: SerializeOutput = {
    indent: 0,
    text: []
  };

  if (opts.pretty && typeof opts.indentSpaces !== 'number') {
    opts.indentSpaces = 2;
  }

  if (opts.pretty && typeof opts.newLines !== 'boolean') {
    opts.newLines = true;
  }

  if (opts.outerHTML) {
    serializeToHtml(elm, opts, output);
  } else {
    for (let i = 0; i < elm.childNodes.length; i++) {
      serializeToHtml(elm.childNodes[i], opts, output);
    }
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

    serializeAttributes(opts, elm.attributes, output);

    const cssText = elm.style.cssText;
    if (cssText) {
      output.text.push(' style="', cssText, '"');
    }

    output.text.push('>');
  }

  if (!EMPTY_ELEMENTS.has(tagName)) {

    const ignoreTagContent = (opts.excludeTagContent && opts.excludeTagContent.includes(tagName));

    if (!ignoreTagContent) {
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
}


function serializeAttributes(opts: SerializeElementOptions, attrMap: MockAttributeMap, output: SerializeOutput) {
  if (opts.pretty) {
    attrMap.items.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

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

    if (attr.name === 'class' && opts.pretty) {
      const tokens = attr.value.split(' ').filter(t => t !== '').sort();
      attr.value = tokens.join(' ');
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

  const parentTagName = (node.parentNode && node.parentNode.nodeType === NODE_TYPES.ELEMENT_NODE ? node.parentNode.nodeName.toLowerCase() : null);

  if (NON_ESCAPABLE_CONTENT.has(parentTagName)) {
    output.text.push(node.nodeValue);

  } else {
    output.text.push(escapeString(opts.pretty ? prettyText(node as any) : node.nodeValue, false));
  }
}

function prettyText(textNode: Text) {
  return textNode.nodeValue.replace(/\s\s+/g, ' ').trim();
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

const NON_ESCAPABLE_CONTENT = new Set([
  'style',
  'script',
  'xmp',
  'iframe',
  'noembed',
  'noframes',
  'plaintext',
  'noscript'
]);

const EMPTY_ELEMENTS = new Set([
  'area',
  'base',
  'basefont',
  'bgsound',
  'br',
  'col',
  'embed',
  'frame',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'trace',
  'wbr'
]);

interface SerializeOutput {
  indent: number;
  text: string[];
}

export interface SerializeElementOptions {
  outerHTML?: boolean;
  excludeTags?: string[];
  excludeTagContent?: string[];
  indentSpaces?: number;
  newLines?: boolean;
  pretty?: boolean;
}
