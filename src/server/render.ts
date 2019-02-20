import * as d from '@declarations';
import { catchError } from '@utils';
import { connectElements } from './connect-elements';
import { generateHydrateResults, normalizeHydrateOptions } from './hydrate-utils';
import { MockDocument } from '@mock-doc';
import { optimizeHydratedDocument } from './optimize/optimize-hydrated-document';


export function renderToStringSync(html: string, opts: d.HydrateOptions = {}) {
  if (typeof html !== 'string') {
    throw new Error('Invalid html');
  }

  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    const doc: Document = new MockDocument(html) as any;

    setupDocumentFromOpts(doc as any, opts);
    connectElements(opts, results, doc.documentElement);
    updateDocumentFromOpts(doc as any, opts);
    optimizeHydratedDocument(opts, results, doc);

    if (results.diagnostics.length === 0) {
      results.html = doc.documentElement.outerHTML;
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


export function hydrateDocumentSync(doc: Document, opts: d.HydrateOptions = {}) {
  if (doc == null || doc.documentElement == null || typeof doc.documentElement.nodeType !== 'number') {
    throw new Error('Invalid document');
  }

  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    setupDocumentFromOpts(doc as any, opts);
    connectElements(opts, results, doc.documentElement);
    updateDocumentFromOpts(doc as any, opts);
    optimizeHydratedDocument(opts, results, doc);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


function setupDocumentFromOpts(doc: MockDocument, opts: d.HydrateOptions) {
  if (typeof opts.url === 'string') {
    try {
      (doc.defaultView as Window).location.href = opts.url;
    } catch (e) {}
  }
  if (typeof opts.cookie === 'string') {
    try {
      doc.cookie = opts.cookie;
    } catch (e) {}
  }
  if (typeof opts.referrer === 'string') {
    try {
      doc.referrer = opts.referrer;
    } catch (e) {}
  }
  if (typeof opts.direction === 'string') {
    try {
      doc.documentElement.setAttribute('dir', opts.direction);
    } catch (e) {}
  }
  if (typeof opts.language === 'string') {
    try {
      doc.documentElement.setAttribute('lang', opts.language);
    } catch (e) {}
  }
  if (typeof opts.userAgent === 'string') {
    try {
      doc.defaultView.navigator.userAgent = opts.userAgent;
    } catch (e) {}
  }
}


function updateDocumentFromOpts(doc: MockDocument, opts: d.HydrateOptions) {
  if (typeof opts.title === 'string') {
    try {
      doc.title = opts.title;
    } catch (e) {}
  }

  if (Array.isArray(opts.headElements) === true) {
    opts.headElements.forEach(elmData => {
      const headElm = doc.createElement(elmData.tag);
      if (elmData.attributes != null) {
        Object.keys(elmData.attributes).forEach(attrKey => {
          headElm.setAttribute(attrKey, elmData.attributes[attrKey as any]);
        });
      }
      doc.head.appendChild(headElm);
    });
  }
}
