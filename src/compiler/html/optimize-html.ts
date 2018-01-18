import { Config, CompilerCtx, HydrateOptions, HydrateResults } from '../../util/interfaces';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { inlineLoaderScript } from './inline-loader-script';
import { inlineComponentStyles } from '../css/inline-styles';
import { inlineExternalAssets } from './inline-external-assets';
import { insertCanonicalLink } from './canonical-link';


export async function optimizeHtml(config: Config, ctx: CompilerCtx, doc: Document, styles: string[], opts: HydrateOptions, results: HydrateResults) {
  setHtmlDataSsrAttr(doc);

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
    try {
      await inlineLoaderScript(config, ctx, doc, results);

    } catch (e) {
      results.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Loader Script',
        messageText: e
      });
    }
  }

  if (opts.inlineAssetsMaxSize > 0) {
    try {
      await inlineExternalAssets(config, ctx, results, doc);

    } catch (e) {
      results.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline External Styles',
        messageText: e
      });
    }
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
}


function setHtmlDataSsrAttr(doc: Document) {
  doc.documentElement.setAttribute('data-ssr', '');
}
