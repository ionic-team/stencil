import { createDocument, serializeNodeToHtml } from '@stencil/core/mock-doc';
import { catchError, isFunction, isPromise, isString } from '@utils';
import { hasStencilScript, inlineExternalStyleSheets, minifyScriptElements, minifyStyleElements, removeStencilScripts, } from './prerender-optimize';
export const generateTemplateHtml = async (config, prerenderConfig, diagnostics, isDebug, srcIndexHtmlPath, outputTarget, hydrateOpts, manager) => {
    try {
        if (!isString(srcIndexHtmlPath)) {
            srcIndexHtmlPath = outputTarget.indexHtml;
        }
        let templateHtml;
        if (isFunction(prerenderConfig.loadTemplate)) {
            const loadTemplateResult = prerenderConfig.loadTemplate(srcIndexHtmlPath);
            if (isPromise(loadTemplateResult)) {
                templateHtml = await loadTemplateResult;
            }
            else {
                templateHtml = loadTemplateResult;
            }
        }
        else {
            templateHtml = await config.sys.readFile(srcIndexHtmlPath);
        }
        let doc = createDocument(templateHtml);
        let staticSite = false;
        if (prerenderConfig.staticSite) {
            // purposely do not want any client-side JS
            // go through the document and remove only stencil's scripts
            removeStencilScripts(doc);
            staticSite = true;
        }
        else {
            // config didn't set if it's a staticSite only,
            // but the HTML may not have any stencil scripts at all,
            // so we'll need to know that so we don't add preload modules
            // if there isn't at least one stencil script then it's a static site
            staticSite = !hasStencilScript(doc);
        }
        doc.documentElement.classList.add('hydrated');
        if (hydrateOpts.inlineExternalStyleSheets && !isDebug) {
            try {
                await inlineExternalStyleSheets(config.sys, outputTarget.appDir, doc);
            }
            catch (e) {
                catchError(diagnostics, e);
            }
        }
        if (hydrateOpts.minifyScriptElements && !isDebug) {
            try {
                await minifyScriptElements(doc, true);
            }
            catch (e) {
                catchError(diagnostics, e);
            }
        }
        if (hydrateOpts.minifyStyleElements && !isDebug) {
            try {
                const baseUrl = new URL(outputTarget.baseUrl, manager.devServerHostUrl);
                await minifyStyleElements(config.sys, outputTarget.appDir, doc, baseUrl, true);
            }
            catch (e) {
                catchError(diagnostics, e);
            }
        }
        if (isFunction(prerenderConfig.beforeSerializeTemplate)) {
            const beforeSerializeResults = prerenderConfig.beforeSerializeTemplate(doc);
            if (isPromise(beforeSerializeResults)) {
                doc = await beforeSerializeResults;
            }
            else {
                doc = beforeSerializeResults;
            }
        }
        let html = serializeNodeToHtml(doc);
        if (isFunction(prerenderConfig.afterSerializeTemplate)) {
            const afterSerializeResults = prerenderConfig.afterSerializeTemplate(html);
            if (isPromise(afterSerializeResults)) {
                html = await afterSerializeResults;
            }
            else {
                html = afterSerializeResults;
            }
        }
        return {
            html,
            staticSite,
        };
    }
    catch (e) {
        catchError(diagnostics, e);
    }
    return undefined;
};
//# sourceMappingURL=prerender-template-html.js.map