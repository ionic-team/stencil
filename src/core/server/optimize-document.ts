import { HydrateOptions } from '../../util/interfaces';
import { removeUnusedCss } from '../css/remove-unused-css';
import { COMMENT_NODE, TEXT_NODE } from '../../util/constants';


export function optimizeDocument(doc: Document, css: string, opts: HydrateOptions) {

  if (css !== null && css.length > 0) {
    const styleElm = doc.createElement('style');
    styleElm.innerHTML = opts.removeUnusedCss !== false ? removeUnusedCss(doc.documentElement, css) : css;
    doc.head.insertBefore(styleElm, doc.head.firstChild);
  }

  if (opts.reduceHtmlWhitepace !== false) {
    reduceHtmlWhitepace(doc.body);
  }

}


export function reduceHtmlWhitepace(node: Node) {
  // this isn't about reducing HTML filesize (cuz it doesn't really matter after gzip)
  // this is more about having many less nodes for the client side to
  // have to climb through while it's creating vnodes from this HTML

  if (WHITESPACE_SENSITIVE_TAGS.indexOf((<HTMLElement>node).tagName) > -1) {
    return;
  }

  var lastWhitespaceTextNode: Node = null;

  for (var i = node.childNodes.length - 1; i >= 0; i--) {
    var childNode = node.childNodes[i];

    if (childNode.nodeType === TEXT_NODE || childNode.nodeType === COMMENT_NODE) {

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
      reduceHtmlWhitepace(childNode);
    }

    lastWhitespaceTextNode = null;
  }

}

const REDUCE_WHITESPACE_REGEX = /\s\s+/g;
const WHITESPACE_SENSITIVE_TAGS = ['PRE', 'SCRIPT', 'STYLE', 'TEXTAREA'];
