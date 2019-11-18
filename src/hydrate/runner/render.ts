import * as d from '../../declarations';
import { generateHydrateResults, normalizeHydrateOptions, renderBuildError, renderCatchError } from './render-utils';
import { hydrateFactory } from '@hydrate-factory';
import { initializeWindow } from './window-initialize';
import { inspectElement } from './inspect-element';
import { MockWindow, serializeNodeToHtml } from '@mock-doc';
import { patchDomImplementation } from './patch-dom-implementation';
import { relocateMetaCharset } from '../../compiler/html/relocate-meta-charset';
import { removeUnusedStyles } from '../../compiler/html/remove-unused-styles';
import { updateCanonicalLink } from '../../compiler/html/canonical-link';


export function renderToString(html: string | Document, userOpts?: d.RenderToStringOptions) {
  const opts = normalizeHydrateOptions(userOpts);
  opts.serializeToHtml = true;

  return new Promise<d.HydrateResults>(resolve => {
    const results = generateHydrateResults(opts);
    if (results.diagnostics.length > 0) {
      resolve(results);

    } else if (typeof html === 'string') {
      try {
        opts.destroyWindow = true;
        opts.destroyDocument = true;

        const win = new MockWindow(html) as any as Window;
        render(win, opts, results, resolve);

      } catch (e) {
        renderCatchError(results, e);
        resolve(results);
      }

    } else if (isValidDocument(html)) {
      try {
        opts.destroyDocument = false;
        const win = patchDomImplementation(html, opts);
        render(win, opts, results, resolve);

      } catch (e) {
        renderCatchError(results, e);
        resolve(results);
      }

    } else {
      renderBuildError(results, `Invalid html or document. Must be either valid "html" string, or DOM "document".`);
      resolve(results);
    }
  });
}


export function hydrateDocument(doc: Document | string, userOpts?: d.RenderToStringOptions) {
  const opts = normalizeHydrateOptions(userOpts);
  opts.serializeToHtml = false;

  return new Promise<d.HydrateResults>(resolve => {
    const results = generateHydrateResults(opts);
    if (results.diagnostics.length > 0) {
      resolve(results);

    } else if (typeof doc === 'string') {
      try {
        opts.destroyWindow = true;
        opts.destroyDocument = true;

        const win = new MockWindow(doc) as any as Window;
        render(win, opts, results, resolve);

      } catch (e) {
        renderCatchError(results, e);
        resolve(results);
      }

    } else if (isValidDocument(doc)) {
      try {
        opts.destroyDocument = false;
        const win = patchDomImplementation(doc, opts);
        render(win, opts, results, resolve);

      } catch (e) {
        renderCatchError(results, e);
        resolve(results);
      }

    } else {
      renderBuildError(results, `Invalid html or document. Must be either valid "html" string, or DOM "document".`);
      resolve(results);
    }
  });
}


function isValidDocument(doc: Document) {
  return doc != null &&
    doc.nodeType === 9 &&
    doc.documentElement != null &&
    doc.documentElement.nodeType === 1 &&
    doc.body != null &&
    doc.body.nodeType === 1;
}


function render(win: Window, opts: d.HydrateFactoryOptions, results: d.HydrateResults, resolve: (results: d.HydrateResults) => void) {
  if (!(process as any).__stencilErrors) {
    (process as any).__stencilErrors = true;

    process.on('unhandledRejection', e => {
      console.log('unhandledRejection', e);
    });
  }

  initializeWindow(win, opts, results);

  if (typeof opts.beforeHydrate === 'function') {
    try {
      const rtn = opts.beforeHydrate(win.document);
      if (rtn != null && typeof rtn.then === 'function') {
        rtn.then(() => {
          hydrateFactory(win, opts, results, afterHydrate, resolve);
        });
      } else {
        hydrateFactory(win, opts, results, afterHydrate, resolve);
      }

    } catch (e) {
      renderCatchError(results, e);
      finalizeHydrate(win, opts, results, resolve);
    }

  } else {
    hydrateFactory(win, opts, results, afterHydrate, resolve);
  }
}

function afterHydrate(win: Window, opts: d.HydrateFactoryOptions, results: d.HydrateResults, resolve: (results: d.HydrateResults) => void) {
  if (typeof opts.afterHydrate === 'function') {
    try {
      const rtn = opts.afterHydrate(win.document);
      if (rtn != null && typeof rtn.then === 'function') {
        rtn.then(() => {
          finalizeHydrate(win, opts, results, resolve);
        });
      } else {
        finalizeHydrate(win, opts, results, resolve);
      }

    } catch (e) {
      renderCatchError(results, e);
      finalizeHydrate(win, opts, results, resolve);
    }

  } else {
    finalizeHydrate(win, opts, results, resolve);
  }
}

function finalizeHydrate(win: Window, opts: d.HydrateFactoryOptions, results: d.HydrateResults, resolve: (results: d.HydrateResults) => void) {
  try {
    inspectElement(results, win.document.documentElement, 0);

    if (opts.removeUnusedStyles !== false) {
      try {
        removeUnusedStyles(win.document, results.diagnostics);
      } catch (e) {
        renderCatchError(results, e);
      }
    }

    if (typeof opts.title === 'string') {
      try {
        win.document.title = opts.title;
      } catch (e) {
        renderCatchError(results, e);
      }
    }

    results.title = win.document.title;

    if (opts.removeScripts) {
      removeScripts(win.document.documentElement);
    }

    try {
      updateCanonicalLink(win.document, opts.canonicalUrl);
    } catch (e) {
      renderCatchError(results, e);
    }

    try {
      relocateMetaCharset(win.document);
    } catch (e) {}

    try {
      const metaStatus = win.document.head.querySelector('meta[http-equiv="status"]');
      if (metaStatus != null) {
        const content = metaStatus.getAttribute('content');
        if (content != null) {
          results.httpStatus = parseInt(content, 10);
        }
      }
    } catch (e) {}

    if (opts.clientHydrateAnnotations) {
      win.document.documentElement.classList.add('hydrated');
    }

    if (opts.serializeToHtml) {
      results.html = serializeNodeToHtml(win.document, {
        approximateLineWidth: opts.approximateLineWidth,
        outerHtml: false,
        prettyHtml: opts.prettyHtml,
        removeAttributeQuotes: opts.removeAttributeQuotes,
        removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
        removeEmptyAttributes: opts.removeEmptyAttributes,
        removeHtmlComments: opts.removeHtmlComments,
        serializeShadowRoot: false,
      });
    }

  } catch (e) {
    renderCatchError(results, e);
  }

  if (opts.destroyWindow) {
    try {
      if (!opts.destroyDocument) {
        const doc = win.document;
        (win as any).document = null;
        (doc as any).defaultView = null;
      }

      win.close();

    } catch (e) {
      renderCatchError(results, e);
    }
  }

  resolve(results);
}


function removeScripts(elm: HTMLElement) {
  const children = elm.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    removeScripts(child as any);

    if (child.nodeName === 'SCRIPT') {
      child.remove();
    } else if (child.nodeName === 'LINK' && child.getAttribute('rel') === 'modulepreload') {
      child.remove();
    }
  }
}
