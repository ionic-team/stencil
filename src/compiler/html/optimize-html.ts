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
    setHtmlDataSsrAttr(doc);
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

  if (config.minifyCss) {
    promises.push(minifyInlineStyles(config, compilerCtx, doc, results));
  }

  if (config.minifyJs) {
    promises.push(minifyInlineScripts(config, compilerCtx, doc, results));
  }

  await Promise.all(promises);
}


function setHtmlDataSsrAttr(doc: Document) {
  doc.documentElement.setAttribute('data-ssr', '');
}
