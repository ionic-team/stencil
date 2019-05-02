import * as d from '../declarations';
import { buildError } from '@utils';
import { crawlDocument } from './crawl-document';
import { finalizeWindow } from './window-finalize';
import { generateHydrateResults, normalizeHydrateOptions, renderError } from './render-utils';
import { getHydrateAppSandbox } from './run-in-context';
import { initializeWindow } from './window-initialize';
import { MockWindow, serializeNodeToHtml } from '@mock-doc';
import { polyfillDocumentImplementation } from './polyfill-implementation';


export async function renderToString(html: string, opts: d.RenderToStringOptions = {}) {
  opts = normalizeHydrateOptions(opts);

  const results = generateHydrateResults(opts);
  if (results.diagnostics.length > 0) {
    return results;
  }

  if (typeof html !== 'string') {
    const err = buildError(results.diagnostics);
    err.messageText = `Invalid html`;
    return results;
  }

  try {
    const win: Window = new MockWindow(html) as any;
    const doc = win.document;

    if (typeof opts.beforeHydrate === 'function') {
      try {
        const rtn = opts.beforeHydrate(win);
        if (rtn != null && typeof rtn.then === 'function') {
          await rtn;
        }
      } catch (e) {
        renderError(results, e);
      }
    }

    await render(win, doc, opts, results);

    if (typeof opts.afterHydrate === 'function') {
      try {
        const rtn = opts.afterHydrate(win);
        if (rtn != null && typeof rtn.then === 'function') {
          await rtn;
        }
      } catch (e) {
        renderError(results, e);
      }
    }

    if (!results.diagnostics.some(d => d.type === 'error')) {
      results.html = serializeNodeToHtml(doc, {
        approximateLineWidth: opts.approximateLineWidth,
        outerHtml: false,
        prettyHtml: opts.prettyHtml,
        removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
        removeEmptyAttributes: opts.removeEmptyAttributes,
        removeHtmlComments: false,
        serializeShadowRoot: false
      });
    }

  } catch (e) {
    renderError(results, e);
  }

  return results;
}


export async function hydrateDocument(doc: Document, opts: d.HydrateDocumentOptions = {}) {
  opts = normalizeHydrateOptions(opts);

  const results = generateHydrateResults(opts);
  if (results.diagnostics.length > 0) {
    return results;
  }

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

    await render(win, doc, opts, results);

  } catch (e) {
    renderError(results, e);
  }

  return results;
}


async function render(win: Window, doc: Document, opts: d.HydrateDocumentOptions, results: d.HydrateResults) {
  catchUnhandledErrors(results);

  initializeWindow(win, doc, opts, results);

  await new Promise(resolve => {
    const tmr = setTimeout(() => {
      win.console.error(`Hydrate exceeded timeout: ${opts.timeout}ms`);
      resolve();
    }, opts.timeout);

    try {
      const sandbox = getHydrateAppSandbox(win);

      sandbox.initConnect(win, doc, opts, results, () => {
        clearTimeout(tmr);
        resolve();
      });

    } catch (e) {
      renderError(results, e);
      clearTimeout(tmr);
      resolve();
    }
  });

  crawlDocument(doc, results);

  finalizeWindow(doc, opts, results);
}


function catchUnhandledErrors(results: d.HydrateResults) {
  if ((process as any).__stencilErrors) {
    return;
  }
  (process as any).__stencilErrors = true;

  process.on('unhandledRejection', e => {
    renderError(results, e);
  });
}
