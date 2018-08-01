import * as d from '../../declarations';
import { removeUnusedStyles } from './remove-unused-styles';
import { UsedSelectors } from '../html/used-selectors';


export function optimizeSsrStyles(config: d.Config, outputTarget: d.OutputTargetHydrate, doc: Document, diagnostics: d.Diagnostic[]) {
  // get all the styles that were added during prerendering
  const styleElms = doc.head.querySelectorAll(`style`) as NodeListOf<HTMLStyleElement>;

  if (styleElms.length === 0) {
    // this doc doesn't have any ssr styles
    return;
  }

  removeUnusedStylesFromSsrStyles(config, outputTarget, doc, diagnostics, styleElms);
}


function removeUnusedStylesFromSsrStyles(config: d.Config, outputTarget: d.OutputTargetHydrate, doc: Document, diagnostics: d.Diagnostic[], styleElms: NodeListOf<HTMLStyleElement>) {
  // removeUnusedStyles is the default
  if (outputTarget.removeUnusedStyles === false) {
    // specifically set to false so we do not want to remove unused styles
    return;
  }

  try {
    // pick out all of the selectors that are actually
    // being used in the html document
    const usedSelectors = new UsedSelectors(doc.documentElement);

    for (let i = 0; i < styleElms.length; i++) {
      // loop through each style element in the document
      // and remove any css selectors that would not be applied this this document
      removeUnusedStylesFromSsrStyle(config, diagnostics, usedSelectors, styleElms[i]);
    }

  } catch (e) {
    diagnostics.push({
      level: 'error',
      type: 'hydrate',
      header: 'HTML Selector Parse',
      messageText: e
    });
  }
}


function removeUnusedStylesFromSsrStyle(config: d.Config, diagnostics: d.Diagnostic[], usedSelectors: UsedSelectors, ssrStyleElm: HTMLStyleElement) {
  try {
    // remove any selectors that are not used in this document
    ssrStyleElm.innerHTML = removeUnusedStyles(config, usedSelectors, ssrStyleElm.innerHTML, diagnostics);

  } catch (e) {
    diagnostics.push({
      level: 'error',
      type: 'hydrate',
      header: 'Removing Unused Styles',
      messageText: e
    });
  }
}
