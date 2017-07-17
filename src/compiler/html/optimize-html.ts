import { BuildConfig, FilesMap, HydrateOptions, HydrateResults } from '../../util/interfaces';
import { BuildContext } from '../interfaces';
import { HtmlUsedSelectors } from './html-used-selectors';
import { inlineLoaderScript } from './inline-loader-script';
import { reduceHtmlWhitepace } from './reduce-html-whitespace';
import { removeUnusedCss } from '../css/remove-unused-css';


export function optimizeHtml(config: BuildConfig, ctx: BuildContext, doc: Document, stylesMap: FilesMap, opts: HydrateOptions, hydrateResults: HydrateResults) {
  const styleFileNames = Object.keys(stylesMap);

  if (styleFileNames.length) {
    let styles = '';

    if (opts.removeUnusedCss !== false) {
      // removeUnusedCss is the default
      try {
        // pick out all of the selectors that are actually
        // being used in the html document
        const usedSelectors = new HtmlUsedSelectors(doc.documentElement);

        const cssFilePaths = Object.keys(stylesMap);

        styles = cssFilePaths.map(cssFilePath => {
          return removeUnusedCss(config, usedSelectors, stylesMap[cssFilePath], cssFilePath, hydrateResults.diagnostics);
        }).join('');

      } catch (e) {
        hydrateResults.diagnostics.push({
          level: 'error',
          type: 'hydrate',
          header: 'HTML Selector Parse',
          messageText: e
        });
      }

    } else {
      styles = styleFileNames.map(styleFileName => stylesMap[styleFileName]).join('');
    }

    // insert our styles to the head of the document
    if (styles) {
      const styleElm = doc.createElement('style');
      styleElm.innerHTML = styles;
      doc.head.insertBefore(styleElm, doc.head.firstChild);
    }
  }

  if (opts.reduceHtmlWhitepace !== false) {
    // reduceHtmlWhitepace is the default
    try {
      reduceHtmlWhitepace(doc.body);

    } catch (e) {
      hydrateResults.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Reduce HTML Whitespace',
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
      hydrateResults.diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'Inline Loader Script',
        messageText: e
      });
    }
  }
}
