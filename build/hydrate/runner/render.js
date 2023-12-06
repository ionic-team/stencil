import { hydrateFactory } from '@hydrate-factory';
import { MockWindow, serializeNodeToHtml } from '@stencil/core/mock-doc';
import { hasError, isPromise } from '@utils';
import { updateCanonicalLink } from '../../compiler/html/canonical-link';
import { relocateMetaCharset } from '../../compiler/html/relocate-meta-charset';
import { removeUnusedStyles } from '../../compiler/html/remove-unused-styles';
import { inspectElement } from './inspect-element';
import { patchDomImplementation } from './patch-dom-implementation';
import { generateHydrateResults, normalizeHydrateOptions, renderBuildError, renderCatchError } from './render-utils';
import { initializeWindow } from './window-initialize';
export function renderToString(html, options) {
    const opts = normalizeHydrateOptions(options);
    opts.serializeToHtml = true;
    return new Promise((resolve) => {
        let win;
        const results = generateHydrateResults(opts);
        if (hasError(results.diagnostics)) {
            resolve(results);
        }
        else if (typeof html === 'string') {
            try {
                opts.destroyWindow = true;
                opts.destroyDocument = true;
                win = new MockWindow(html);
                render(win, opts, results, resolve);
            }
            catch (e) {
                if (win && win.close) {
                    win.close();
                }
                win = null;
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else if (isValidDocument(html)) {
            try {
                opts.destroyDocument = false;
                win = patchDomImplementation(html, opts);
                render(win, opts, results, resolve);
            }
            catch (e) {
                if (win && win.close) {
                    win.close();
                }
                win = null;
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else {
            renderBuildError(results, `Invalid html or document. Must be either a valid "html" string, or DOM "document".`);
            resolve(results);
        }
    });
}
export function hydrateDocument(doc, options) {
    const opts = normalizeHydrateOptions(options);
    opts.serializeToHtml = false;
    return new Promise((resolve) => {
        let win;
        const results = generateHydrateResults(opts);
        if (hasError(results.diagnostics)) {
            resolve(results);
        }
        else if (typeof doc === 'string') {
            try {
                opts.destroyWindow = true;
                opts.destroyDocument = true;
                win = new MockWindow(doc);
                render(win, opts, results, resolve);
            }
            catch (e) {
                if (win && win.close) {
                    win.close();
                }
                win = null;
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else if (isValidDocument(doc)) {
            try {
                opts.destroyDocument = false;
                win = patchDomImplementation(doc, opts);
                render(win, opts, results, resolve);
            }
            catch (e) {
                if (win && win.close) {
                    win.close();
                }
                win = null;
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else {
            renderBuildError(results, `Invalid html or document. Must be either a valid "html" string, or DOM "document".`);
            resolve(results);
        }
    });
}
function render(win, opts, results, resolve) {
    if (!process.__stencilErrors) {
        process.__stencilErrors = true;
        process.on('unhandledRejection', (e) => {
            console.log('unhandledRejection', e);
        });
    }
    initializeWindow(win, win.document, opts, results);
    if (typeof opts.beforeHydrate === 'function') {
        try {
            const rtn = opts.beforeHydrate(win.document);
            if (isPromise(rtn)) {
                rtn.then(() => {
                    hydrateFactory(win, opts, results, afterHydrate, resolve);
                });
            }
            else {
                hydrateFactory(win, opts, results, afterHydrate, resolve);
            }
        }
        catch (e) {
            renderCatchError(results, e);
            finalizeHydrate(win, win.document, opts, results, resolve);
        }
    }
    else {
        hydrateFactory(win, opts, results, afterHydrate, resolve);
    }
}
function afterHydrate(win, opts, results, resolve) {
    if (typeof opts.afterHydrate === 'function') {
        try {
            const rtn = opts.afterHydrate(win.document);
            if (isPromise(rtn)) {
                rtn.then(() => {
                    finalizeHydrate(win, win.document, opts, results, resolve);
                });
            }
            else {
                finalizeHydrate(win, win.document, opts, results, resolve);
            }
        }
        catch (e) {
            renderCatchError(results, e);
            finalizeHydrate(win, win.document, opts, results, resolve);
        }
    }
    else {
        finalizeHydrate(win, win.document, opts, results, resolve);
    }
}
function finalizeHydrate(win, doc, opts, results, resolve) {
    try {
        inspectElement(results, doc.documentElement, 0);
        if (opts.removeUnusedStyles !== false) {
            try {
                removeUnusedStyles(doc, results.diagnostics);
            }
            catch (e) {
                renderCatchError(results, e);
            }
        }
        if (typeof opts.title === 'string') {
            try {
                doc.title = opts.title;
            }
            catch (e) {
                renderCatchError(results, e);
            }
        }
        results.title = doc.title;
        if (opts.removeScripts) {
            removeScripts(doc.documentElement);
        }
        try {
            updateCanonicalLink(doc, opts.canonicalUrl);
        }
        catch (e) {
            renderCatchError(results, e);
        }
        try {
            relocateMetaCharset(doc);
        }
        catch (e) { }
        if (!hasError(results.diagnostics)) {
            results.httpStatus = 200;
        }
        try {
            const metaStatus = doc.head.querySelector('meta[http-equiv="status"]');
            if (metaStatus != null) {
                const metaStatusContent = metaStatus.getAttribute('content');
                if (metaStatusContent && metaStatusContent.length > 0) {
                    results.httpStatus = parseInt(metaStatusContent, 10);
                }
            }
        }
        catch (e) { }
        if (opts.clientHydrateAnnotations) {
            doc.documentElement.classList.add('hydrated');
        }
        if (opts.serializeToHtml) {
            results.html = serializeDocumentToString(doc, opts);
        }
    }
    catch (e) {
        renderCatchError(results, e);
    }
    if (opts.destroyWindow) {
        try {
            if (!opts.destroyDocument) {
                win.document = null;
                doc.defaultView = null;
            }
            if (win.close) {
                win.close();
            }
        }
        catch (e) {
            renderCatchError(results, e);
        }
    }
    resolve(results);
}
export function serializeDocumentToString(doc, opts) {
    return serializeNodeToHtml(doc, {
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
function isValidDocument(doc) {
    return (doc != null &&
        doc.nodeType === 9 &&
        doc.documentElement != null &&
        doc.documentElement.nodeType === 1 &&
        doc.body != null &&
        doc.body.nodeType === 1);
}
function removeScripts(elm) {
    const children = elm.children;
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        removeScripts(child);
        if (child.nodeName === 'SCRIPT' || (child.nodeName === 'LINK' && child.getAttribute('rel') === 'modulepreload')) {
            child.remove();
        }
    }
}
//# sourceMappingURL=render.js.map