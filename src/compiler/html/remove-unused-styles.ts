import * as d from '../../declarations';
import { parseCss } from '../style/css-parser/parse-css';
import { serializeCss } from '../style/css-parser/serialize-css';
import { UsedSelectors } from '../style/css-parser/used-selectors';
import { hasError } from '@utils';


export function removeUnusedStyles(doc: Document, diagnostics: d.Diagnostic[]) {
  const styleElms = doc.head.querySelectorAll<HTMLStyleElement>(`style[data-styles]`);

  if (styleElms.length > 0) {
    // pick out all of the selectors that are actually
    // being used in the html document
    const usedSelectors = new UsedSelectors(doc.body);

    for (let i = 0; i < styleElms.length; i++) {
      removeUnusedStyleText(usedSelectors, diagnostics, styleElms[i]);
    }
  }
}


function removeUnusedStyleText(usedSelectors: UsedSelectors, diagnostics: d.Diagnostic[], styleElm: HTMLStyleElement) {
  try {
    // parse the css from being applied to the document
    const parseResults = parseCss(styleElm.innerHTML);

    diagnostics.push(...parseResults.diagnostics);
    if (hasError(diagnostics)) {
      return;
    }

    try {
      // convert the parsed css back into a string
      // but only keeping what was found in our active selectors
      styleElm.innerHTML = serializeCss(parseResults.stylesheet, {
        usedSelectors
      });

    } catch (e) {
      diagnostics.push({
        level: 'warn',
        type: 'css',
        header: 'CSS Stringify',
        messageText: e
      });
    }

  } catch (e) {
    diagnostics.push({
      level: 'warn',
      type: 'css',
      header: 'CSS Parse',
      messageText: e
    });
  }
}
