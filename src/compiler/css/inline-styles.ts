import { BuildConfig, Diagnostic, FilesMap, HydrateOptions } from '../../util/interfaces';
import { removeUnusedStyles } from './remove-unused-styles';
import { UsedSelectors } from '../html/used-selectors';


export function inlineStyles(config: BuildConfig, doc: Document, stylesMap: FilesMap, opts: HydrateOptions, diagnostics: Diagnostic[]) {
  const styleFileNames = Object.keys(stylesMap);

  if (!styleFileNames.length) {
    return;
  }

  let styles: string[] = [];

  if (opts.removeUnusedStyles !== false) {
    // removeUnusedStyles is the default
    try {
      // pick out all of the selectors that are actually
      // being used in the html document
      const usedSelectors = new UsedSelectors(doc.documentElement);

      const cssFilePaths = Object.keys(stylesMap);

      styles = cssFilePaths.map(cssFilePath => {
        return removeUnusedStyles(config, usedSelectors, stylesMap[cssFilePath], cssFilePath, diagnostics);
      });

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'HTML Selector Parse',
        messageText: e
      });
    }

  } else {
    // do not removeUnusedStyles
    styles = styleFileNames.map(styleFileName => stylesMap[styleFileName]);
  }

  // insert our styles to the head of the document
  insertStyles(doc, styles);
}


function insertStyles(doc: Document, styles: string[]) {
  if (!styles.length) {
    return;
  }

  const styleElm = doc.createElement('style');

  styleElm.setAttribute('data-styles', '');
  styleElm.innerHTML = styles.join('').trim();

  if (styleElm.innerHTML.length) {
    doc.head.insertBefore(styleElm, doc.head.firstChild);
  }
}
