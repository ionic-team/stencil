import * as c from '../../util/constants';
import * as d from '../../declarations';
import { buildWarn } from '../util';


export function validateIndexHtml(doc: Document, diagnostics: d.Diagnostic[]) {
  validateDocType(doc, diagnostics);
  validateHead(doc, diagnostics);
}


function validateDocType(doc: Document, diagnostics: d.Diagnostic[]) {
  // make sure that this html page has the document type node at the root
  // <!DOCTYPE html>
  for (let i = 0; i < doc.childNodes.length; i++) {
    if (doc.childNodes[i].nodeType === c.NODE_TYPE.DocumentTypeNode) {
      // all good
      return;
    }
  }

  const header = `Missing <!DOCTYPE html>`;
  if (diagnostics.some(dg => dg.header === header)) {
    return;
  }

  const diagnostic = buildWarn(diagnostics);
  diagnostic.header = header;
  diagnostic.messageText = `It is recommended at all HTML documents start with the <!DOCTYPE html> doctype to ensure HTML5 compliance. Please add <!DOCTYPE html> to the beginning of the index.html file, before the <html> element. For more information about declaring a doctype, please see: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Introduction_to_HTML5`;
}


function validateHead(doc: Document, diagnostics: d.Diagnostic[]) {
  // make sure that this html page has a charset in the head
  if (!doc.head) {
    const header = `Index Missing <head> element`;
    if (diagnostics.some(dg => dg.header === header)) {
      return;
    }
    const diagnostic = buildWarn(diagnostics);
    diagnostic.header = header;
    diagnostic.messageText = `Index HTML content must have the <head> element as the first child of the <html> element.`;
    return;
  }

  validateCharset(doc.head, diagnostics);
}


function validateCharset(head: HTMLHeadElement, diagnostics: d.Diagnostic[]) {
  // make sure that this html page has a charset in the head
  for (let i = 0; i < head.children.length; i++) {
    if (head.children[i].nodeName.toLowerCase() === 'meta') {
      // all good
      const charset = head.children[i].getAttribute('charset');
      if (charset && charset.toLowerCase() === 'utf-8') {
        return;
      }
    }
  }

  const header = `Invalid <meta charset="UTF-8">`;
  if (diagnostics.some(dg => dg.header === header)) {
    return;
  }
  const diagnostic = buildWarn(diagnostics);
  diagnostic.header = header;
  diagnostic.messageText = `Within the document's <head> element, the first element must be the <meta charset="UTF-8"> meta tag, which is highly recommended for increased security. For more information about meta charset, please see: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Introduction_to_HTML5`;
}
