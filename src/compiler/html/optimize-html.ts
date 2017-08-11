import { BuildConfig, BuildContext, Diagnostic, FilesMap, HydrateOptions } from '../../util/interfaces';
import { inlineLoaderScript } from './inline-loader-script';
import { reduceHtmlWhitepace } from './reduce-html-whitespace';
import { inlineStyles } from '../css/inline-styles';


export function optimizeHtml(config: BuildConfig, ctx: BuildContext, doc: Document, stylesMap: FilesMap, opts: HydrateOptions, diagnostics: Diagnostic[]) {
  if (opts.inlineStyles !== false) {
    try {
      inlineStyles(config, doc, stylesMap, opts, diagnostics);

    } catch (e) {
      diagnostics.push({
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
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Loader Script',
        messageText: e
      });
    }
  }

  if (opts.reduceHtmlWhitepace !== false) {
    // reduceHtmlWhitepace is the default
    try {
      reduceHtmlWhitepace(doc.body);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Reduce HTML Whitespace',
        messageText: e
      });
    }
  }
}
