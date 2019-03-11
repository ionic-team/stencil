import * as d from '../declarations';
import { catchError } from '@utils';
import { connectElements } from './connect-elements';
import { generateHydrateResults, normalizeHydrateOptions } from './hydrate-utils';
import { MockWindow, serializeNodeToHtml } from '@mock-doc';
import { optimizeHydratedDocument } from './optimize/optimize-hydrated-document';
import globalScripts from '@global-scripts';


export async function renderToString(html: string, opts: d.HydrateOptions = {}) {
  if (typeof html !== 'string') {
    throw new Error('Invalid html');
  }

  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    const win: Window = new MockWindow(html) as any;
    const doc = win.document;

    const windowLocationUrl = setWindowUrl(win, opts);
    setupDocumentFromOpts(results, windowLocationUrl, win, doc, opts);

    const waitPromises: Promise<any>[] = [];
    connectElements(opts, results, doc.body, waitPromises);
    await Promise.all(waitPromises);

    optimizeHydratedDocument(opts, results, windowLocationUrl, doc);

    if (results.diagnostics.length === 0) {
      results.html = serializeNodeToHtml(doc, {
        collapseBooleanAttributes: opts.collapseBooleanAttributes,
        pretty: opts.prettyHtml
      });
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


export async function hydrateDocument(doc: Document, opts: d.HydrateOptions = {}) {
  if (doc == null || doc.documentElement == null || typeof doc.documentElement.nodeType !== 'number') {
    throw new Error('Invalid document');
  }

  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    const win: Window = doc.defaultView || new MockWindow(false) as any;
    if (win.document !== doc) {
      (win as any).document = doc;
    }
    if (doc.defaultView !== win) {
      (doc as any).defaultView = win;
    }

    const windowLocationUrl = setWindowUrl(win, opts);
    setupDocumentFromOpts(results, windowLocationUrl, win, doc, opts);

    const waitPromises: Promise<any>[] = [];
    connectElements(opts, results, doc.body, waitPromises);
    await Promise.all(waitPromises);

    optimizeHydratedDocument(opts, results, windowLocationUrl, doc);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


function setupDocumentFromOpts(results: d.HydrateResults, windowLocationUrl: URL, win: Window, doc: Document, opts: d.HydrateOptions) {
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
    globalScripts(win, true);
  } catch (e) {
    catchError(results.diagnostics, e);
  }
}


function setWindowUrl(win: Window, opts: d.HydrateOptions) {
  const url = typeof opts.url === 'string' ? opts.url : BASE_URL;
  try {
    win.location.href = url;
  } catch (e) {}
  return new URL(url, BASE_URL);
}

const BASE_URL = 'http://prerender.stenciljs.com';
