import * as d from '../declarations';
import { catchError, isPromise } from '@utils';
import { hasStencilScript, inlineExternalStyleSheets, minifyScriptElements, minifyStyleElements, removeStencilScripts } from './prerender-optimize';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export async function generateTemplateHtml(
  prerenderConfig: d.PrerenderConfig,
  diagnostics: d.Diagnostic[],
  isDebug: boolean,
  srcIndexHtmlPath: string,
  outputTarget: d.OutputTargetWww,
  hydrateOpts: d.PrerenderHydrateOptions,
) {
  try {
    const { createDocument, serializeNodeToHtml } = await import('@stencil/core/mock-doc');

    if (typeof srcIndexHtmlPath !== 'string') {
      srcIndexHtmlPath = outputTarget.indexHtml;
    }

    let templateHtml: string;
    if (typeof prerenderConfig.loadTemplate === 'function') {
      const loadTemplateResult = prerenderConfig.loadTemplate(srcIndexHtmlPath);
      if (isPromise(loadTemplateResult)) {
        templateHtml = await loadTemplateResult;
      } else {
        templateHtml = loadTemplateResult;
      }
    } else {
      templateHtml = await readFile(srcIndexHtmlPath, 'utf8');
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
        await inlineExternalStyleSheets(outputTarget.appDir, doc);
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
        await minifyStyleElements(doc, true);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    if (typeof prerenderConfig.beforeSerializeTemplate === 'function') {
      const beforeSerializeResults = prerenderConfig.beforeSerializeTemplate(doc);
      if (isPromise(beforeSerializeResults)) {
        doc = await beforeSerializeResults;
      } else {
        doc = beforeSerializeResults;
      }
    }

    let html = serializeNodeToHtml(doc);

    if (typeof prerenderConfig.afterSerializeTemplate === 'function') {
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
}
