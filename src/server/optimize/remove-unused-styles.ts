import * as d from '@declarations';
import { parseCss } from '../../compiler/style/parse-css';
import { StringifyCss } from '../../compiler/style/stringify-css';
import { UsedSelectors } from '../../compiler/style/used-selectors';


export function removeUnusedStyles(results: d.HydrateResults, doc: Document, styleElm: HTMLStyleElement) {
  try {
    // parse the css from being applied to the document
    const cssAst = parseCss(styleElm.innerHTML);

    if (cssAst.stylesheet.diagnostics.length > 0) {
      cssAst.stylesheet.diagnostics.forEach(d => {
        results.diagnostics.push(d);
      });
      return;
    }

    try {
      // pick out all of the selectors that are actually
      // being used in the html document
      const usedSelectors = new UsedSelectors(doc.body);

      // convert the parsed css back into a string
      // but only keeping what was found in our active selectors
      const stringify = new StringifyCss({ usedSelectors });
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
