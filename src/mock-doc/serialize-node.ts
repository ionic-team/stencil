import { MockElement, MockNode } from './node';
import { MockAttr } from './attribute';
import { NODE_TYPES } from './constants';


export function serializeNodeToHtml(elm: MockElement, opts: SerializeElementOptions = {}) {
  const output: SerializeOutput = {
    indent: 0,
    text: []
  };

  if (opts.pretty === true) {
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 2;
    }

    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = true;
    }
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

  if (typeof opts.removeHtmlComments !== 'boolean') {
    opts.removeHtmlComments = false;
  }

  if (opts.outerHTML === true) {
    serializeToHtml(elm, opts, output);

  } else {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
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

    const ignoreTag = (opts.excludeTags != null && opts.excludeTags.includes(tagName) === true);

    if (ignoreTag === false) {

      if (opts.newLines === true) {
        output.text.push('\n');
      }

      if (opts.indentSpaces > 0) {
        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
      }

      output.text.push('<' + tagName);

      if (opts.pretty === true) {
        (node as MockElement).attributes.items.sort(sortAttrs);
      }

      for (let i = 0, attrsLength = (node as MockElement).attributes.items.length; i < attrsLength; i++) {
        const attr = (node as MockElement).attributes.items[i];
        const attrName = attr.name;

        if (attrName === 'style') {
          continue;
        }

        let attrValue = attr.value;
        if (opts.removeEmptyAttributes === true && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName) === true) {
          continue;
        }

        const attrNamespaceURI = attr.namespaceURI;
        if (attrNamespaceURI == null) {
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

        if (opts.pretty === true && attrName === 'class') {
          attrValue = attr.value = attrValue.split(' ').filter(t => t !== '').sort().join(' ').trim();

        } else if (attrValue === '') {
          if ((opts.collapseBooleanAttributes === true && BOOLEAN_ATTR.has(attrName) === true) || (opts.removeEmptyAttributes === true && attrName.startsWith('data-'))) {
            continue;
          }
        }

        if (opts.removeAttributeQuotes === true && CAN_REMOVE_ATTR_QUOTES.test(attrValue) === true) {
          output.text.push('=' + escapeString(attrValue, true));
        } else {
          output.text.push('="' + escapeString(attrValue, true) + '"');
        }
      }

      if ((node as MockElement).hasAttribute('style') === true) {
        output.text.push(` style="${
          opts.minifyInlineStyles ? ((node as MockElement).style.cssTextMinified || (node as MockElement).style.cssText) :
          ((node as MockElement).style.cssText)
        }">`);

      } else {
        output.text.push('>');
      }
    }

    if (EMPTY_ELEMENTS.has(tagName) === false) {
      const ignoreTagContent = (opts.excludeTagContent != null && opts.excludeTagContent.includes(tagName) === true);

      if (ignoreTagContent === false) {
        const childNodes: MockNode[] = tagName === 'template' ? (((node as any) as HTMLTemplateElement).content.childNodes as any) : (node.childNodes);

        if (childNodes.length > 0) {
          if (childNodes.length === 1 && childNodes[0].nodeType === 3 && typeof node.nodeValue === 'string' && childNodes[0].nodeValue.trim() === '') {
            // skip over empty text nodes

          } else {
            if (opts.indentSpaces > 0 && ignoreTag === false) {
              output.indent = output.indent + opts.indentSpaces;
            }

            for (let i = 0, ii = childNodes.length; i < ii; i++) {
              serializeToHtml(childNodes[i], opts, output);
            }

            if (opts.newLines === true && ignoreTag === false) {
              output.text.push('\n');
            }

            if (opts.indentSpaces > 0 && ignoreTag === false) {
              output.indent = output.indent - opts.indentSpaces;

              for (let i = 0; i < output.indent; i++) {
                output.text.push(' ');
              }
            }
          }
        }

        if (ignoreTag === false) {
          output.text.push('</' + tagName + '>');
        }
      }
    }

  } else if (node.nodeType === NODE_TYPES.TEXT_NODE) {
    if (typeof node.nodeValue === 'string' && node.nodeValue.trim() !== '') {
      if (opts.newLines === true) {
        output.text.push('\n');
      }

      if (opts.indentSpaces > 0) {
        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
      }

      const parentTagName = (node.parentNode != null && node.parentNode.nodeType === NODE_TYPES.ELEMENT_NODE ? node.parentNode.nodeName : null);

      if (NON_ESCAPABLE_CONTENT.has(parentTagName) === true) {
        output.text.push(node.nodeValue);

      } else {
        if (opts.pretty === true) {
          output.text.push(escapeString(node.nodeValue.replace(/\s\s+/g, ' ').trim(), false));
        } else {
          output.text.push(escapeString(node.nodeValue, false));
        }
      }
    }

  } else if (node.nodeType === NODE_TYPES.COMMENT_NODE && opts.removeHtmlComments === false) {
    if (opts.newLines === true) {
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

function sortAttrs(a: MockAttr, b: MockAttr) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}


const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>\/\\-]+$/;

function escapeString(str: string, attrMode: boolean) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');

  if (attrMode === true) {
    return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  }

  return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}

export const NON_ESCAPABLE_CONTENT = new Set(['STYLE', 'SCRIPT', 'IFRAME', 'NOSCRIPT', 'XMP', 'NOEMBED', 'NOFRAMES', 'PLAINTEXT']);

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
  minifyInlineStyles?: boolean;
  newLines?: boolean;
  outerHTML?: boolean;
  pretty?: boolean;
  removeAttributeQuotes?: boolean;
  removeHtmlComments?: boolean;
  removeEmptyAttributes?: boolean;
}
