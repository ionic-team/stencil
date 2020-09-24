import { cloneAttributes } from './attribute';
import { CONTENT_REF_ID, ORG_LOCATION_ID, SLOT_NODE_ID, TEXT_NODE_ID, XLINK_NS } from '../runtime/runtime-constants';
import { MockNode } from './node';
import { NODE_TYPES } from './constants';

export function serializeNodeToHtml(elm: Node | MockNode, opts: SerializeNodeToHtmlOptions = {}) {
  const output: SerializeOutput = {
    currentLineWidth: 0,
    indent: 0,
    isWithinBody: false,
    text: [],
  };

  if (opts.prettyHtml) {
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 2;
    }

    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = true;
    }
    opts.approximateLineWidth = -1;
  } else {
    opts.prettyHtml = false;
    if (typeof opts.newLines !== 'boolean') {
      opts.newLines = false;
    }
    if (typeof opts.indentSpaces !== 'number') {
      opts.indentSpaces = 0;
    }
  }

  if (typeof opts.approximateLineWidth !== 'number') {
    opts.approximateLineWidth = -1;
  }

  if (typeof opts.removeEmptyAttributes !== 'boolean') {
    opts.removeEmptyAttributes = true;
  }

  if (typeof opts.removeAttributeQuotes !== 'boolean') {
    opts.removeAttributeQuotes = false;
  }

  if (typeof opts.removeBooleanAttributeQuotes !== 'boolean') {
    opts.removeBooleanAttributeQuotes = false;
  }

  if (typeof opts.removeHtmlComments !== 'boolean') {
    opts.removeHtmlComments = false;
  }

  if (typeof opts.serializeShadowRoot !== 'boolean') {
    opts.serializeShadowRoot = false;
  }

  if (opts.outerHtml) {
    serializeToHtml(elm as Node, opts, output, false);
  } else {
    for (let i = 0, ii = elm.childNodes.length; i < ii; i++) {
      serializeToHtml(elm.childNodes[i] as Node, opts, output, false);
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

function serializeToHtml(node: Node, opts: SerializeNodeToHtmlOptions, output: SerializeOutput, isShadowRoot: boolean) {
  if (node.nodeType === NODE_TYPES.ELEMENT_NODE || isShadowRoot) {
    const tagName = isShadowRoot ? 'mock:shadow-root' : getTagName(node as Element);

    if (tagName === 'body') {
      output.isWithinBody = true;
    }

    const ignoreTag = opts.excludeTags != null && opts.excludeTags.includes(tagName);

    if (ignoreTag === false) {
      const isWithinWhitespaceSensitiveNode =
        opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
      if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
        output.text.push('\n');
        output.currentLineWidth = 0;
      }

      if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
        for (let i = 0; i < output.indent; i++) {
          output.text.push(' ');
        }
        output.currentLineWidth += output.indent;
      }

      output.text.push('<' + tagName);
      output.currentLineWidth += tagName.length + 1;

      const attrsLength = (node as HTMLElement).attributes.length;
      const attributes =
        opts.prettyHtml && attrsLength > 1
          ? cloneAttributes((node as HTMLElement).attributes as any, true)
          : (node as Element).attributes;

      for (let i = 0; i < attrsLength; i++) {
        const attr = attributes.item(i);
        const attrName = attr.name;

        if (attrName === 'style') {
          continue;
        }

        let attrValue = attr.value;
        if (opts.removeEmptyAttributes && attrValue === '' && REMOVE_EMPTY_ATTR.has(attrName)) {
          continue;
        }

        const attrNamespaceURI = attr.namespaceURI;
        if (attrNamespaceURI == null) {
          output.currentLineWidth += attrName.length + 1;
          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            output.text.push('\n' + attrName);
            output.currentLineWidth = 0;
          } else {
            output.text.push(' ' + attrName);
          }
        } else if (attrNamespaceURI === 'http://www.w3.org/XML/1998/namespace') {
          output.text.push(' xml:' + attrName);
          output.currentLineWidth += attrName.length + 5;
        } else if (attrNamespaceURI === 'http://www.w3.org/2000/xmlns/') {
          if (attrName !== 'xmlns') {
            output.text.push(' xmlns:' + attrName);
            output.currentLineWidth += attrName.length + 7;
          } else {
            output.text.push(' ' + attrName);
            output.currentLineWidth += attrName.length + 1;
          }
        } else if (attrNamespaceURI === XLINK_NS) {
          output.text.push(' xlink:' + attrName);
          output.currentLineWidth += attrName.length + 7;
        } else {
          output.text.push(' ' + attrNamespaceURI + ':' + attrName);
          output.currentLineWidth += attrNamespaceURI.length + attrName.length + 2;
        }

        if (opts.prettyHtml && attrName === 'class') {
          attrValue = attr.value = attrValue
            .split(' ')
            .filter(t => t !== '')
            .sort()
            .join(' ')
            .trim();
        }

        if (attrValue === '') {
          if (opts.removeBooleanAttributeQuotes && BOOLEAN_ATTR.has(attrName)) {
            continue;
          }
          if (opts.removeEmptyAttributes && attrName.startsWith('data-')) {
            continue;
          }
        }

        if (opts.removeAttributeQuotes && CAN_REMOVE_ATTR_QUOTES.test(attrValue)) {
          output.text.push('=' + escapeString(attrValue, true));
          output.currentLineWidth += attrValue.length + 1;
        } else {
          output.text.push('="' + escapeString(attrValue, true) + '"');
          output.currentLineWidth += attrValue.length + 3;
        }
      }

      if ((node as Element).hasAttribute('style')) {
        const cssText = (node as HTMLElement).style.cssText;

        if (
          opts.approximateLineWidth > 0 &&
          output.currentLineWidth + cssText.length + 10 > opts.approximateLineWidth
        ) {
          output.text.push(`\nstyle="${cssText}">`);
          output.currentLineWidth = 0;
        } else {
          output.text.push(` style="${cssText}">`);
          output.currentLineWidth += cssText.length + 10;
        }
      } else {
        output.text.push('>');
        output.currentLineWidth += 1;
      }
    }

    if (EMPTY_ELEMENTS.has(tagName) === false) {
      if (opts.serializeShadowRoot && (node as HTMLElement).shadowRoot != null) {
        output.indent = output.indent + opts.indentSpaces;
        serializeToHtml((node as HTMLElement).shadowRoot, opts, output, true);
        output.indent = output.indent - opts.indentSpaces;

        if (
          opts.newLines &&
          (node.childNodes.length === 0 ||
            (node.childNodes.length === 1 &&
              node.childNodes[0].nodeType === NODE_TYPES.TEXT_NODE &&
              node.childNodes[0].nodeValue.trim() === ''))
        ) {
          output.text.push('\n');
          output.currentLineWidth = 0;

          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }
      }

      if (opts.excludeTagContent == null || opts.excludeTagContent.includes(tagName) === false) {
        const childNodes =
          tagName === 'template' ? (((node as any) as HTMLTemplateElement).content.childNodes as any) : node.childNodes;
        const childNodeLength = childNodes.length;

        if (childNodeLength > 0) {
          if (
            childNodeLength === 1 &&
            childNodes[0].nodeType === NODE_TYPES.TEXT_NODE &&
            (typeof childNodes[0].nodeValue !== 'string' || childNodes[0].nodeValue.trim() === '')
          ) {
            // skip over empty text nodes
          } else {
            const isWithinWhitespaceSensitiveNode =
              opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;

            if (!isWithinWhitespaceSensitiveNode && opts.indentSpaces > 0 && ignoreTag === false) {
              output.indent = output.indent + opts.indentSpaces;
            }

            for (let i = 0; i < childNodeLength; i++) {
              serializeToHtml(childNodes[i], opts, output, false);
            }

            if (ignoreTag === false) {
              if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
                output.text.push('\n');
                output.currentLineWidth = 0;
              }

              if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
                output.indent = output.indent - opts.indentSpaces;
                for (let i = 0; i < output.indent; i++) {
                  output.text.push(' ');
                }
                output.currentLineWidth += output.indent;
              }
            }
          }
        }

        if (ignoreTag === false) {
          output.text.push('</' + tagName + '>');
          output.currentLineWidth += tagName.length + 3;
        }
      }
    }

    if (opts.approximateLineWidth > 0 && STRUCTURE_ELEMENTS.has(tagName)) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }

    if (tagName === 'body') {
      output.isWithinBody = false;
    }
  } else if (node.nodeType === NODE_TYPES.TEXT_NODE) {
    let textContent = node.nodeValue;

    if (typeof textContent === 'string') {
      const trimmedTextContent = textContent.trim();
      if (trimmedTextContent === '') {
        // this text node is whitespace only
        if (isWithinWhitespaceSensitive(node)) {
          // whitespace matters within this element
          // just add the exact text we were given
          output.text.push(textContent);
          output.currentLineWidth += textContent.length;
        } else if (opts.approximateLineWidth > 0 && !output.isWithinBody) {
          // do nothing if we're not in the <body> and we're tracking line width
        } else if (!opts.prettyHtml) {
          // this text node is only whitespace, and it's not
          // within a whitespace sensitive element like <pre> or <code>
          // so replace the entire white space with a single new line
          output.currentLineWidth += 1;

          if (opts.approximateLineWidth > 0 && output.currentLineWidth > opts.approximateLineWidth) {
            // good enough for a new line
            // for perf these are all just estimates
            // we don't care to ensure exact line lengths
            output.text.push('\n');
            output.currentLineWidth = 0;
          } else {
            // let's keep it all on the same line yet
            output.text.push(' ');
          }
        }
      } else {
        // this text node has text content
        const isWithinWhitespaceSensitiveNode =
          opts.newLines || opts.indentSpaces > 0 || opts.prettyHtml ? isWithinWhitespaceSensitive(node) : false;
        if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
          output.text.push('\n');
          output.currentLineWidth = 0;
        }

        if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
          for (let i = 0; i < output.indent; i++) {
            output.text.push(' ');
          }
          output.currentLineWidth += output.indent;
        }

        let textContentLength = textContent.length;
        if (textContentLength > 0) {
          // this text node has text content

          const parentTagName =
            node.parentNode != null && node.parentNode.nodeType === NODE_TYPES.ELEMENT_NODE
              ? node.parentNode.nodeName
              : null;
          if (NON_ESCAPABLE_CONTENT.has(parentTagName)) {
            // this text node cannot have its content escaped since it's going
            // into an element like <style> or <script>
            if (isWithinWhitespaceSensitive(node)) {
              output.text.push(textContent);
            } else {
              output.text.push(trimmedTextContent);
              textContentLength = trimmedTextContent.length;
            }
            output.currentLineWidth += textContentLength;
          } else {
            // this text node is going into a normal element and html can be escaped
            if (opts.prettyHtml && !isWithinWhitespaceSensitiveNode) {
              // pretty print the text node
              output.text.push(escapeString(textContent.replace(/\s\s+/g, ' ').trim(), false));
              output.currentLineWidth += textContentLength;
            } else {
              // not pretty printing the text node
              if (isWithinWhitespaceSensitive(node)) {
                output.currentLineWidth += textContentLength;
              } else {
                // this element is not a whitespace sensitive one, like <pre> or <code> so
                // any whitespace at the start and end can be cleaned up to just be one space
                if (/\s/.test(textContent.charAt(0))) {
                  textContent = ' ' + textContent.trimLeft();
                }

                textContentLength = textContent.length;
                if (textContentLength > 1) {
                  if (/\s/.test(textContent.charAt(textContentLength - 1))) {
                    if (
                      opts.approximateLineWidth > 0 &&
                      output.currentLineWidth + textContentLength > opts.approximateLineWidth
                    ) {
                      textContent = textContent.trimRight() + '\n';
                      output.currentLineWidth = 0;
                    } else {
                      textContent = textContent.trimRight() + ' ';
                    }
                  }
                }
                output.currentLineWidth += textContentLength;
              }

              output.text.push(escapeString(textContent, false));
            }
          }
        }
      }
    }
  } else if (node.nodeType === NODE_TYPES.COMMENT_NODE) {
    const nodeValue = node.nodeValue;

    if (opts.removeHtmlComments) {
      const isHydrateAnnotation =
        nodeValue.startsWith(CONTENT_REF_ID + '.') ||
        nodeValue.startsWith(ORG_LOCATION_ID + '.') ||
        nodeValue.startsWith(SLOT_NODE_ID + '.') ||
        nodeValue.startsWith(TEXT_NODE_ID + '.');
      if (!isHydrateAnnotation) {
        return;
      }
    }

    const isWithinWhitespaceSensitiveNode =
      opts.newLines || opts.indentSpaces > 0 ? isWithinWhitespaceSensitive(node) : false;
    if (opts.newLines && !isWithinWhitespaceSensitiveNode) {
      output.text.push('\n');
      output.currentLineWidth = 0;
    }

    if (opts.indentSpaces > 0 && !isWithinWhitespaceSensitiveNode) {
      for (let i = 0; i < output.indent; i++) {
        output.text.push(' ');
      }
      output.currentLineWidth += output.indent;
    }

    output.text.push('<!--' + nodeValue + '-->');
    output.currentLineWidth += nodeValue.length + 7;
  } else if (node.nodeType === NODE_TYPES.DOCUMENT_TYPE_NODE) {
    output.text.push('<!doctype html>');
  }
}

const AMP_REGEX = /&/g;
const NBSP_REGEX = /\u00a0/g;
const DOUBLE_QUOTE_REGEX = /"/g;
const LT_REGEX = /</g;
const GT_REGEX = />/g;
const CAN_REMOVE_ATTR_QUOTES = /^[^ \t\n\f\r"'`=<>\/\\-]+$/;

function getTagName(element: Element) {
  if (element.namespaceURI === 'http://www.w3.org/1999/xhtml') {
    return element.nodeName.toLowerCase();
  } else {
    return element.nodeName;
  }
}

function escapeString(str: string, attrMode: boolean) {
  str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');

  if (attrMode) {
    return str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
  }

  return str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
}

function isWithinWhitespaceSensitive(node: Node) {
  while (node != null) {
    if (WHITESPACE_SENSITIVE.has(node.nodeName)) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

/*@__PURE__*/ export const NON_ESCAPABLE_CONTENT = new Set([
  'STYLE',
  'SCRIPT',
  'IFRAME',
  'NOSCRIPT',
  'XMP',
  'NOEMBED',
  'NOFRAMES',
  'PLAINTEXT',
]);

/*@__PURE__*/ export const WHITESPACE_SENSITIVE = new Set([
  'CODE',
  'OUTPUT',
  'PLAINTEXT',
  'PRE',
  'SCRIPT',
  'TEMPLATE',
  'TEXTAREA',
]);

/*@__PURE__*/ const EMPTY_ELEMENTS = new Set([
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
  'wbr',
]);

/*@__PURE__*/ const REMOVE_EMPTY_ATTR = new Set(['class', 'dir', 'id', 'lang', 'name', 'title']);

/*@__PURE__*/ const BOOLEAN_ATTR = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'compact',
  'controls',
  'declare',
  'default',
  'defaultchecked',
  'defaultmuted',
  'defaultselected',
  'defer',
  'disabled',
  'enabled',
  'formnovalidate',
  'hidden',
  'indeterminate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nohref',
  'nomodule',
  'noresize',
  'noshade',
  'novalidate',
  'nowrap',
  'open',
  'pauseonexit',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'seamless',
  'selected',
  'sortable',
  'truespeed',
  'typemustmatch',
  'visible',
]);

/*@__PURE__*/ const STRUCTURE_ELEMENTS = new Set([
  'html',
  'body',
  'head',
  'iframe',
  'meta',
  'link',
  'base',
  'title',
  'script',
  'style',
]);

interface SerializeOutput {
  currentLineWidth: number;
  indent: number;
  isWithinBody: boolean;
  text: string[];
}

export interface SerializeNodeToHtmlOptions {
  approximateLineWidth?: number;
  excludeTagContent?: string[];
  excludeTags?: string[];
  indentSpaces?: number;
  newLines?: boolean;
  outerHtml?: boolean;
  prettyHtml?: boolean;
  removeAttributeQuotes?: boolean;
  removeBooleanAttributeQuotes?: boolean;
  removeEmptyAttributes?: boolean;
  removeHtmlComments?: boolean;
  serializeShadowRoot?: boolean;
}
