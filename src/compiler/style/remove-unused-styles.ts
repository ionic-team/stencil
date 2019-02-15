import * as d from '@declarations';
import { parseCss } from './parse-css';
import { StringifyCss } from './stringify-css';
import { UsedSelectors } from './used-selectors';


export function removeUnusedStyles(results: d.HydrateResults, usedSelectors: UsedSelectors, cssContent: string) {
  let cleanedCss = cssContent;

  try {
    // parse the css from being applied to the document
    const cssAst = parseCss(cssContent);

    if (cssAst.stylesheet.diagnostics.length > 0) {
      cssAst.stylesheet.diagnostics.forEach(d => {
        results.diagnostics.push(d);
      });
      return cleanedCss;
    }

    try {
      // convert the parsed css back into a string
      // but only keeping what was found in our active selectors
      const stringify = new StringifyCss({ usedSelectors });
      cleanedCss = stringify.compile(cssAst);

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

  return cleanedCss;
}
