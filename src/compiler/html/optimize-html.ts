import { assetsFileVersioning } from './assets-file-versioning';
import { CompilerCtx, Config, HydrateOptions, HydrateResults } from '../../declarations';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { inlineComponentStyles } from '../style/inline-styles';
import { inlineExternalAssets } from './inline-external-assets';
import { inlineLoaderScript } from './inline-loader-script';
import { insertCanonicalLink } from './canonical-link';
import { minifyInlineScripts } from './minify-inline-scripts';
import { minifyInlineStyles } from '../style/minify-inline-styles';


export async function optimizeHtml(config: Config, compilerCtx: CompilerCtx, doc: Document, styles: string[], opts: HydrateOptions, results: HydrateResults) {
  const promises: Promise<any>[] = [];

  if (opts.hydrateComponents !== false) {
    doc.documentElement.setAttribute('data-ssr', '');
  }

  if (opts.canonicalLink !== false) {
    try {
      insertCanonicalLink(config, doc, results);

    } catch (e) {
      results.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Insert Canonical Link',
        messageText: e
      });
    }
  }

  if (opts.inlineStyles !== false) {
    try {
      inlineComponentStyles(config, doc, styles, results, results.diagnostics);

    } catch (e) {
      results.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Component Styles',
        messageText: e
      });
    }
  }

  if (opts.inlineLoaderScript !== false) {
    // remove the script to the external loader script request
    // inline the loader script at the bottom of the html
    promises.push(inlineLoaderScript(config, compilerCtx, doc, results));
  }

  if (opts.inlineAssetsMaxSize > 0) {
    promises.push(inlineExternalAssets(config, compilerCtx, results, doc));
  }

  if (opts.collapseWhitespace !== false && !config.devMode && config.logger.level !== 'debug') {
    // collapseWhitespace is the default
    try {
      config.logger.debug(`optimize ${results.pathname}, collapse html whitespace`);
      collapseHtmlWhitepace(doc.documentElement);

    } catch (e) {
      results.diagnostics.push({
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
    promises.push(minifyInlineStyles(config, compilerCtx, doc, results));
  }

  if (config.minifyJs) {
    promises.push(minifyInlineScripts(config, compilerCtx, doc, results));
  }

  if (opts.assetsFileVersioning) {
    promises.push(assetsFileVersioning(config, compilerCtx, results.url, doc));
  }

  await Promise.all(promises);
}
