import * as d from '@declarations';
import { catchError } from '@utils';
import { connectElements } from './connect-elements';
import { generateHydrateResults, normalizeHydrateOptions } from './hydrate-utils';
import { MockDocument, serializeNodeToHtml } from '@mock-doc';
import { optimizeHydratedDocument } from './optimize/optimize-hydrated-document';
import globalScripts from '@global-scripts';


export function renderToStringSync(html: string, opts: d.HydrateOptions = {}) {
  if (typeof html !== 'string') {
    throw new Error('Invalid html');
  }

  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    const doc: Document = new MockDocument(html) as any;

    const windowLocationUrl = setWindowUrl(doc as any, opts);
    setupDocumentFromOpts(results, windowLocationUrl, doc, opts);

    connectElements(opts, results, doc.documentElement);
    optimizeHydratedDocument(opts, results, windowLocationUrl, doc);

    if (results.diagnostics.length === 0) {
      results.html = serializeNodeToHtml(doc, {
        collapseBooleanAttributes: opts.collapseBooleanAttributes,
        pretty: opts.prettyHtml,
        removeHtmlComments: opts.removeHtmlComments
      });
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
    const windowLocationUrl = setWindowUrl(doc as any, opts);
    setupDocumentFromOpts(results, windowLocationUrl, doc, opts);

    connectElements(opts, results, doc.documentElement);
    optimizeHydratedDocument(opts, results, windowLocationUrl, doc);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


function setupDocumentFromOpts(results: d.HydrateResults, windowLocationUrl: URL, doc: Document, opts: d.HydrateOptions) {
  const win = (doc.defaultView as Window);

  if (typeof opts.url === 'string') {
    try {
      win.location.href = opts.url;
    } catch (e) {}
  }
  if (typeof opts.userAgent === 'string') {
    try {
      (win.navigator as any).userAgent = opts.userAgent;
    } catch (e) {}
  }
  if (typeof opts.cookie === 'string') {
    try {
      doc.cookie = opts.cookie;
    } catch (e) {}
  }
  if (typeof opts.referrer === 'string') {
    try {
      (doc as any).referrer = opts.referrer;
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
  if (typeof opts.beforeHydrate === 'function') {
    try {
      opts.beforeHydrate(doc as any, windowLocationUrl);
    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }

  try {
    globalScripts(win);
  } catch (e) {
    catchError(results.diagnostics, e);
  }
}


function setWindowUrl(doc: MockDocument, opts: d.HydrateOptions) {
  const url = typeof opts.url === 'string' ? opts.url : BASE_URL;
  try {
    (doc.defaultView as Window).location.href = url;
  } catch (e) {}
  return new URL(url, BASE_URL);
}

const BASE_URL = 'http://prerender.stenciljs.com';
