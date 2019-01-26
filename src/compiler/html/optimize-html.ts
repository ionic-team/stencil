import * as d from '@declarations';
import { assetVersioning } from '../asset-versioning/asset-versioning';
import { catchError } from '@utils';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { inlineExternalAssets } from './inline-external-assets';
import { logger } from '@sys';
import { minifyInlineScripts, minifyInlineStyles } from './minify-inline-content';
import { mockDocument } from '@mock-doc';
import { optimizeSsrStyles } from '../style/optimize-ssr-styles';
import { relocateMetaCharset } from './relocate-meta-charset';
import { updateCanonicalLink } from './canonical-link';


export async function optimizeHtml(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  hydrateTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  doc: Document,
  diagnostics: d.Diagnostic[]
) {
  const promises: Promise<any>[] = [];

  if (hydrateTarget.hydrateComponents) {
    doc.documentElement.setAttribute(
      'data-ssr',
      (typeof hydrateTarget.timestamp === 'string' ? hydrateTarget.timestamp : '')
    );
  }

  if (hydrateTarget.canonicalLink) {
    try {
      updateCanonicalLink(doc, windowLocationPath);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Insert Canonical Link',
        messageText: e
      });
    }
  }

  if (hydrateTarget.inlineStyles) {
    try {
      optimizeSsrStyles(config, hydrateTarget, doc, diagnostics);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Component Styles',
        messageText: e
      });
    }
  }

  // if (hydrateTarget.inlineLoaderScript) {
  //   // remove the script to the external loader script request
  //   // inline the loader script at the bottom of the html
  //   promises.push(inlineLoaderScript(compilerCtx, hydrateTarget, windowLocationPath, doc));
  // }

  if (hydrateTarget.inlineAssetsMaxSize > 0) {
    promises.push(inlineExternalAssets(compilerCtx, hydrateTarget, windowLocationPath, doc));
  }

  if (hydrateTarget.collapseWhitespace && !config.devMode && config.logLevel !== 'debug') {
    // collapseWhitespace is the default
    try {
      logger.debug(`optimize ${windowLocationPath}, collapse html whitespace`);
      collapseHtmlWhitepace(doc.documentElement);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Reduce HTML Whitespace',
        messageText: e
      });
    }
  }

  // need to wait on to see if external files are inlined
  await Promise.all(promises);

  // reset for new promises
  promises.length = 0;

  if (config.minifyCss) {
    promises.push(minifyInlineStyles(config, compilerCtx, doc, diagnostics));
  }

  if (config.minifyJs) {
    promises.push(minifyInlineScripts(config, compilerCtx, doc, diagnostics));
  }

  if (config.assetVersioning) {
    promises.push(assetVersioning(config, compilerCtx, hydrateTarget, windowLocationPath, doc));
  }

  relocateMetaCharset(doc);

  await Promise.all(promises);
}


export async function optimizeIndexHtml(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  hydrateTarget: d.OutputTargetHydrate,
  windowLocationPath: string,
  diagnostics: d.Diagnostic[]
) {
  try {
    hydrateTarget.html = await compilerCtx.fs.readFile(hydrateTarget.indexHtml);

    try {
      const doc = mockDocument(hydrateTarget.html);

      await optimizeHtml(config, compilerCtx, hydrateTarget, windowLocationPath, doc, diagnostics);

      // serialize this dom back into a string
      await compilerCtx.fs.writeFile(hydrateTarget.indexHtml, doc.documentElement.outerHTML);

    } catch (e) {
      catchError(diagnostics, e);
    }

  } catch (e) {
    // index.html file doesn't exist, which is fine
  }
}
