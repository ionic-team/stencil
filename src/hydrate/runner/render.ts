import * as d from '../../declarations';
import { BootstrapHydrateResults } from '../platform/bootstrap-hydrate';
import { createHydrateAppSandbox } from './vm-sandbox';
import { finalizeWindow } from './window-finalize';
import { generateHydrateResults, normalizeHydrateOptions, renderBuildError, renderCatchError } from './render-utils';
import { initializeWindow } from './window-initialize';
import { inspectElement } from './inspect-document';
import { MockWindow, serializeNodeToHtml } from '@mock-doc';
import { patchDomImplementation } from './patch-dom-implementation';


export async function renderToString(html: string, opts: d.RenderToStringOptions = {}) {
  opts = normalizeHydrateOptions(opts);

  const results = generateHydrateResults(opts);
  if (results.diagnostics.length > 0) {
    return results;
  }

  if (typeof html !== 'string') {
    renderBuildError(results, `Invalid html`);
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
        renderCatchError(results, e);
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
        renderCatchError(results, e);
      }
    }

    if (!results.diagnostics.some(d => d.type === 'error')) {
      results.html = serializeNodeToHtml(doc, {
        approximateLineWidth: opts.approximateLineWidth,
        outerHtml: false,
        prettyHtml: opts.prettyHtml,
        removeAttributeQuotes: opts.removeAttributeQuotes,
        removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
        removeEmptyAttributes: opts.removeEmptyAttributes,
        removeHtmlComments: opts.removeHtmlComments,
        serializeShadowRoot: false
      });
    }

  } catch (e) {
    renderCatchError(results, e);
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
    renderBuildError(results, `Invalid document`);
    return results;
  }

  try {
    const win = patchDomImplementation(doc);

    await render(win, win.document, opts, results);

  } catch (e) {
    renderCatchError(results, e);
  }

  return results;
}


async function render(win: Window, doc: Document, opts: d.HydrateDocumentOptions, results: d.HydrateResults) {
  catchUnhandledErrors(results);

  initializeWindow(win, doc, opts, results);

  await new Promise(resolve => {
    const tmr = setTimeout(() => {
      renderBuildError(results, `Hydrate exceeded timeout`);
      resolve();
    }, opts.timeout);

    try {
      const sandbox = createHydrateAppSandbox(win);

      sandbox.bootstrapHydrate(win, opts, (bootstrapResults: BootstrapHydrateResults) => {
        clearTimeout(tmr);

        try {
          results.hydratedCount = bootstrapResults.hydratedCount;
          bootstrapResults.hydratedComponents.forEach(component => {
            results.components.push({
              tag: component.tag,
              mode: component.mode,
              count: 0,
              depth: -1
            });
          });

        } catch (e) {
          renderCatchError(results, e);
        }

        bootstrapResults = null;
        resolve();
      });

    } catch (e) {
      renderCatchError(results, e);
      clearTimeout(tmr);
      resolve();
    }
  });

  inspectElement(results, doc.documentElement, 0);

  finalizeWindow(doc, opts, results);
}


function catchUnhandledErrors(results: d.HydrateResults) {
  if ((process as any).__stencilErrors) {
    return;
  }
  (process as any).__stencilErrors = true;

  process.on('unhandledRejection', e => {
    renderCatchError(results, e);
  });
}
