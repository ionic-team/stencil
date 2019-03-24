import * as d from '../declarations';
import { buildError, catchError } from '@utils';
import { connectElements } from './connect-elements';
import { finalizeWindow } from './window-finalize';
import { generateHydrateResults, normalizeHydrateOptions } from './hydrate-utils';
import { initializeWindow } from './window-initialize';
import { insertVdomAnnotations } from '@platform';
import { MockWindow, serializeNodeToHtml } from '@mock-doc';


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

    const windowLocationUrl = initializeWindow(results, win, doc, opts);

    const waitPromises: Promise<any>[] = [];
    connectElements(opts, results, doc.body, waitPromises);
    await Promise.all(waitPromises);

    insertVdomAnnotations(opts, doc);

    finalizeWindow(opts, results, windowLocationUrl, doc);

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

  if (doc == null || doc.documentElement == null || typeof doc.documentElement.nodeType !== 'number') {
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

    const windowLocationUrl = initializeWindow(results, win, doc, opts);

    const waitPromises: Promise<any>[] = [];
    connectElements(opts, results, doc.body, waitPromises);
    await Promise.all(waitPromises);

    insertVdomAnnotations(opts, doc);

    finalizeWindow(opts, results, windowLocationUrl, doc);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}
