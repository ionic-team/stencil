import { Config, Diagnostic, HydrateResults } from '../../declarations';
import { removeUnusedStyles } from './remove-unused-styles';
import { UsedSelectors } from '../html/used-selectors';


export function inlineComponentStyles(config: Config, doc: Document, styles: string[], results: HydrateResults, diagnostics: Diagnostic[]) {
  if (!styles.length) {
    return;
  }

  if (results.opts.removeUnusedStyles !== false) {
    // removeUnusedStyles is the default
    try {
      // pick out all of the selectors that are actually
      // being used in the html document
      const usedSelectors = new UsedSelectors(doc.documentElement);

      styles = styles.map(styleText => {
        return removeUnusedStyles(config, usedSelectors, styleText, diagnostics);
      });

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'hydrate',
        header: 'HTML Selector Parse',
        messageText: e
      });
    }
  }

  config.logger.debug(`optimize ${results.pathname}, inline component styles`);

  // insert our styles to the head of the document
  insertStyles(doc, styles);
}


function insertStyles(doc: Document, styles: string[]) {
  const styleElm = doc.createElement('style');

  styleElm.setAttribute('data-styles', '');
  styleElm.innerHTML = styles.join('').trim();

  if (styleElm.innerHTML.length) {
    doc.head.insertBefore(styleElm, doc.head.firstChild);
  }
}
