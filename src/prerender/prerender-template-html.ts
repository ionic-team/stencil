import * as d from '../declarations';
import { catchError } from '@utils';
import { createDocument, serializeNodeToHtml } from '@stencil/core/mock-doc';
import { inlineExternalStyleSheets, minifyScriptElements, minifyStyleElements } from './prerender-optimize';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);


export async function generateTemplateHtml(diagnostics: d.Diagnostic[], isDebug: boolean, srcIndexHtmlPath: string, outputTarget: d.OutputTargetWww, hydrateOpts: d.PrerenderHydrateOptions) {
  try {
    if (typeof srcIndexHtmlPath !== 'string') {
      srcIndexHtmlPath = outputTarget.indexHtml;
    }
    const templateHtml = await readFile(srcIndexHtmlPath, 'utf8');
    const doc = createDocument(templateHtml);

    if (hydrateOpts.inlineExternalStyleSheets && !isDebug) {
      try {
        await inlineExternalStyleSheets(outputTarget.appDir, doc);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    if (hydrateOpts.minifyScriptElements && !isDebug) {
      try {
        await minifyScriptElements(doc);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    if (hydrateOpts.minifyStyleElements && !isDebug) {
      try {
        await minifyStyleElements(doc);
      } catch (e) {
        catchError(diagnostics, e);
      }
    }

    return serializeNodeToHtml(doc);

  } catch (e) {
    catchError(diagnostics, e);
  }
  return undefined;
}
