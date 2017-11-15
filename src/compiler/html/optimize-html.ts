import { BuildConfig, BuildContext, FilesMap, HydrateOptions, HydrateResults } from '../../util/interfaces';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { inlineLoaderScript } from './inline-loader-script';
import { inlineStyles } from '../css/inline-styles';
import { insertCanonicalLink } from './canonical-link';


export function optimizeHtml(config: BuildConfig, ctx: BuildContext, doc: Document, stylesMap: FilesMap, opts: HydrateOptions, results: HydrateResults) {
  setHtmlDataSsrAttr(doc);

  if (opts.canonicalLink !== false) {
    try {
      insertCanonicalLink(config, doc, results.url);

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
      inlineStyles(config, doc, stylesMap, opts, results.diagnostics);

    } catch (e) {
      results.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Styles',
        messageText: e
      });
    }
  }

  if (opts.inlineLoaderScript !== false) {
    // remove the script to the external loader script request
    // inline the loader script at the bottom of the html
    try {
      inlineLoaderScript(config, ctx, doc);

    } catch (e) {
      results.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Loader Script',
        messageText: e
      });
    }
  }

  if (opts.collapseWhitespace !== false && !config.devMode) {
    // collapseWhitespace is the default
    try {
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
