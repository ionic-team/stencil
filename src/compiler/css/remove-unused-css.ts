import { BuildConfig, Diagnostic } from '../../util/interfaces';
import { HtmlUsedSelectors } from '../html/html-used-selectors';
import { parseCss } from './parse-css';
import { StringifyCss } from './stringify-css';


export function removeUnusedCss(config: BuildConfig, usedSelectors: HtmlUsedSelectors, cssContent: string, cssFilePath?: string, diagnostics?: Diagnostic[]) {
  let cleanedCss = cssContent;

  try {
    // parse the css from being applied to the document
    const cssAst = parseCss(config, cssContent, cssFilePath);

    if (cssAst.stylesheet.diagnostics.length) {
      cssAst.stylesheet.diagnostics.forEach(d => {
        diagnostics.push(d);
      });
      return cleanedCss;
    }

    try {
      // convert the parsed css back into a string
      // but only keeping what was found in our active selectors
      const stringify = new StringifyCss(usedSelectors);
      cleanedCss = stringify.compile(cssAst);

    } catch (e) {
      diagnostics.push({
        level: 'error',
        type: 'css',
        header: 'CSS Stringify',
        messageText: e
      });
    }

  } catch (e) {
    diagnostics.push({
      level: 'error',
      type: 'css',
      absFilePath: cssFilePath,
      header: 'CSS Parse',
      messageText: e
    });
  }

  return cleanedCss;
}

