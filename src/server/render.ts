import * as d from '../declarations';
import { buildError, catchError } from '@utils';
import { connectElements } from './connect-elements';
import { finalizeWindow } from './window-finalize';
import { generateHydrateResults, normalizeHydrateOptions } from './hydrate-utils';
import { initializeWindow } from './window-initialize';
import { insertVdomAnnotations } from '@platform';
import { MockWindow, serializeNodeToHtml } from '@mock-doc';
import { polyfillDocumentImplementation } from './polyfill-implementation';


export async function renderToString(html: string, opts: d.HydrateOptions = {}) {
  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  if (typeof html !== 'string') {
    const err = buildError(results.diagnostics);
    err.messageText = `Invalid html`;
    return results;
  }

  try {
    const win: Window = new MockWindow(html) as any;
    const doc = win.document;

    await initializeWindow(results, win, doc, opts);

    const waitPromises: Promise<any>[] = [];
    const hydratedElements = new WeakSet<any>();
    const collectedElements = new WeakSet<any>();

    connectElements(opts, results, doc.body, waitPromises, hydratedElements, collectedElements);

    await Promise.all(waitPromises);

    if (opts.clientHydrateAnnotations) {
      insertVdomAnnotations(doc);
    }

    finalizeWindow(opts, results, win, doc);

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
  opts = normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  if (doc == null || doc.nodeType !== 9 || doc.documentElement == null || doc.documentElement.nodeType !== 1) {
    const err = buildError(results.diagnostics);
    err.messageText = `Invalid document`;
    return results;
  }

  try {
    const win: Window = doc.defaultView || new MockWindow(false) as any;
    if (win.document !== doc) {
      (win as any).document = doc;
    }
    if (doc.defaultView !== win) {
      (doc as any).defaultView = win;
    }

    polyfillDocumentImplementation(win, doc);

    await initializeWindow(results, win, doc, opts);

    const waitPromises: Promise<any>[] = [];
    const hydratedElements = new WeakSet<any>();
    const collectedElements = new WeakSet<any>();

    connectElements(opts, results, doc.body, waitPromises, hydratedElements, collectedElements);

    await Promise.all(waitPromises);

    if (opts.clientHydrateAnnotations) {
      insertVdomAnnotations(doc);
    }

    await finalizeWindow(opts, results, win, doc);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}
