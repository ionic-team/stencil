import * as d from '../../declarations';
import { parseCss } from '../style/parse-css';
import { StringifyCss } from '../style/stringify-css';
import { UsedSelectors } from '../style/used-selectors';


export function removeUnusedStyles(doc: Document, results: d.HydrateResults) {
  const styleElms = doc.head.querySelectorAll<HTMLStyleElement>(`style[data-styles]`);

  if (styleElms.length > 0) {
    // pick out all of the selectors that are actually
    // being used in the html document
    const usedSelectors = new UsedSelectors(doc.body);

    for (let i = 0; i < styleElms.length; i++) {
      removeUnusedStyleText(usedSelectors, results, styleElms[i]);
    }
  }
}


function removeUnusedStyleText(usedSelectors: UsedSelectors, results: d.HydrateResults, styleElm: HTMLStyleElement) {
  try {
    // parse the css from being applied to the document
    const cssAst = parseCss(styleElm.innerHTML);

    if (cssAst.stylesheet.diagnostics.length > 0) {
      results.diagnostics.push(...cssAst.stylesheet.diagnostics);
      return;
    }

    try {
      // convert the parsed css back into a string
      // but only keeping what was found in our active selectors
      const stringify = new StringifyCss(usedSelectors);
      styleElm.innerHTML = stringify.compile(cssAst);

    } catch (e) {
      results.diagnostics.push({
        level: 'warn',
        type: 'css',
        header: 'CSS Stringify',
        messageText: e
      });
    }

  } catch (e) {
    results.diagnostics.push({
      level: 'warn',
      type: 'css',
      header: 'CSS Parse',
      messageText: e
    });
  }
}
