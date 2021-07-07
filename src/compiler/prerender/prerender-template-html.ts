import type * as d from '../../declarations';
import { catchError, isPromise, isFunction, isString } from '@utils';
import {
  hasStencilScript,
  inlineExternalStyleSheets,
  minifyScriptElements,
  minifyStyleElements,
  removeStencilScripts,
} from './prerender-optimize';
import { createDocument, serializeNodeToHtml } from '@stencil/core/mock-doc';

export const generateTemplateHtml = async (
  config: d.Config,
  prerenderConfig: d.PrerenderConfig,
  diagnostics: d.Diagnostic[],
  isDebug: boolean,
  srcIndexHtmlPath: string,
  outputTarget: d.OutputTargetWww,
  hydrateOpts: d.PrerenderHydrateOptions,
  manager: d.PrerenderManager,
) => {
  try {
    if (!isString(srcIndexHtmlPath)) {
      srcIndexHtmlPath = outputTarget.indexHtml;
    }

    let templateHtml: string;
    if (isFunction(prerenderConfig.loadTemplate)) {
      const loadTemplateResult = prerenderConfig.loadTemplate(srcIndexHtmlPath);
      if (isPromise(loadTemplateResult)) {
        templateHtml = await loadTemplateResult;
      } else {
        templateHtml = loadTemplateResult;
      }
    } else {
      templateHtml = await config.sys.readFile(srcIndexHtmlPath);
    }

    let doc = createDocument(templateHtml);

    let staticSite = false;

    if (prerenderConfig.staticSite) {
      // purposely do not want any clientside JS
      // go through the document and remove only stencil's scripts
      removeStencilScripts(doc);
      staticSite = true;
    } else {
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
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    if (hydrateOpts.minifyScriptElements && !isDebug) {
      try {
        await minifyScriptElements(doc, true);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    if (hydrateOpts.minifyStyleElements && !isDebug) {
      try {
        const baseUrl = new URL(outputTarget.baseUrl, manager.devServerHostUrl);
        await minifyStyleElements(config.sys, outputTarget.appDir, doc, baseUrl, true);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    if (isFunction(prerenderConfig.beforeSerializeTemplate)) {
      const beforeSerializeResults = prerenderConfig.beforeSerializeTemplate(doc);
      if (isPromise(beforeSerializeResults)) {
        doc = await beforeSerializeResults;
      } else {
        doc = beforeSerializeResults;
      }
    }

    let html = serializeNodeToHtml(doc);

    if (isFunction(prerenderConfig.afterSerializeTemplate)) {
      const afterSerializeResults = prerenderConfig.afterSerializeTemplate(html);
      if (isPromise(afterSerializeResults)) {
        html = await afterSerializeResults;
      } else {
        html = afterSerializeResults;
      }
    }

    return {
      html,
      staticSite,
    };
  } catch (e) {
    catchError(diagnostics, e);
  }
  return undefined;
};
