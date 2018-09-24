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

  if (typeof opts.removeAttributeQuotes !== 'boolean') {
    opts.removeAttributeQuotes = false;
  }

  if (typeof opts.removeEmptyAttributes !== 'boolean') {
    opts.removeEmptyAttributes = true;
  }

  if (typeof opts.collapseBooleanAttributes !== 'boolean') {
    opts.collapseBooleanAttributes = false;
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
  if (node.nodeType === NODE_TYPES.ELEMENT_NODE) {
    const tagName = node.nodeName.toLowerCase();

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

      output.text.push('<' + tagName);

      if (opts.pretty) {
        (node as MockElement).attributes.items.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      }

      for (let i = 0, attrsLength = (node as MockElement).attributes.items.length; i < attrsLength; i++) {
        const attr = (node as MockElement).attributes.items[i];
        const attrName = attr.name;

        if (attrName === 'style') {
          continue;
        }

        let attrValue = attr.value;
        if (opts.removeEmptyAttributes && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName)) {
          continue;
        }

        const attrNamespaceURI = attr.namespaceURI;
        if (!attrNamespaceURI) {
          output.text.push(' ' + attrName);

        } else if (attrNamespaceURI === 'http://www.w3.org/XML/1998/namespace') {
          output.text.push(' xml:' + attrName);

        } else if (attrNamespaceURI === 'http://www.w3.org/2000/xmlns/') {
          if (attrName !== 'xmlns') {
            output.text.push(' xmlns:' + attrName);
          } else {
            output.text.push(' ' + attrName);
          }

        } else if (attrNamespaceURI === 'http://www.w3.org/1999/xlink') {
          output.text.push(' xlink:' + attrName);

        } else {
          output.text.push(' ' + attrNamespaceURI + ':' + attrName);
        }

        if (attrName === 'class' && opts.pretty) {
          const tokens = attrValue.split(' ').filter(t => t !== '').sort();
          attrValue = attr.value = tokens.join(' ').trim();

        } else if (attrValue === '') {
          if ((opts.collapseBooleanAttributes && BOOLEAN_ATTR.has(attrName)) || (opts.removeEmptyAttributes && attrName.startsWith('data-'))) {
            continue;
          }
        }

        if (opts.removeAttributeQuotes && CAN_REMOVE_ATTR_QUOTES.test(attrValue)) {
          output.text.push('=' + escapeString(attrValue, true));
        } else {
          output.text.push('="' + escapeString(attrValue, true) + '"');
        }
      }

      const cssText = (node as MockElement).style.cssText;
      if (cssText) {
        output.text.push(' style="' + cssText + '">');
      } else {
        output.text.push('>');
      }
    }

    if (!EMPTY_ELEMENTS.has(tagName)) {

      const ignoreTagContent = (opts.excludeTagContent && opts.excludeTagContent.includes(tagName));

      if (!ignoreTagContent) {
        let childNodes: MockNode[];

        if (tagName === 'template') {
          childNodes = ((node as any) as HTMLTemplateElement).content.childNodes as any;
        } else {
          childNodes = node.childNodes;
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
          output.text.push('</' + tagName + '>');
        }
      }
    }

  } else if (node.nodeType === NODE_TYPES.TEXT_NODE) {
    if (node.nodeValue.trim() !== '') {
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
        if (opts.pretty) {
          output.text.push(escapeString(node.nodeValue.replace(/\s\s+/g, ' ').trim(), false));
        } else {
          output.text.push(escapeString(node.nodeValue, false));
        }
      }
    }

  } else if (node.nodeType === NODE_TYPES.COMMENT_NODE) {
    if (opts.newLines) {
      output.text.push('\n');
    }

    if (opts.indentSpaces > 0) {
      for (let i = 0; i < output.indent; i++) {
        output.text.push(' ');
      }
    }

    output.text.push('<!--' + node.nodeValue + '-->');

  } else if (node.nodeType === NODE_TYPES.DOCUMENT_TYPE_NODE) {
    output.text.push('<!doctype html>');
  }
}


const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>]+$/;

function escapeString(str: string, attrMode: boolean) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');

  if (attrMode) {
    return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  }

  return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}

export const NON_ESCAPABLE_CONTENT = new Set(['style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);

const EMPTY_ELEMENTS = new Set(['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'trace', 'wbr']);

const REMOVE_EMPTY_ATTR = new Set(['class', 'dir', 'id', 'lang', 'name', 'title']);

const BOOLEAN_ATTR = new Set(['allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare', 'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple', 'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'readonly', 'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'truespeed', 'typemustmatch', 'visible']);


interface SerializeOutput {
  indent: number;
  text: string[];
}

export interface SerializeElementOptions {
  collapseBooleanAttributes?: boolean;
  excludeTagContent?: string[];
  excludeTags?: string[];
  indentSpaces?: number;
  newLines?: boolean;
  outerHTML?: boolean;
  pretty?: boolean;
  removeAttributeQuotes?: boolean;
  removeEmptyAttributes?: boolean;
}
