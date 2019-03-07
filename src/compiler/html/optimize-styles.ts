import * as d from '@declarations';
import { removeUnusedStyles } from './remove-unused-styles';


export function optimizeStyles(doc: Document, opts: d.HydrateOptions, results: d.HydrateResults) {
  const styleElms = doc.head.querySelectorAll<HTMLStyleElement>(`style[data-styles]`);

  if (styleElms.length === 0) {
    return;
  }

  const styleElm = mergeInlinedStyles(doc, styleElms);

  if (styleElm != null && opts.removeUnusedStyles !== false) {
    try {
      removeUnusedStyles(results, doc, styleElm);

    } catch (e) {
      results.diagnostics.push({
        level: 'warn',
        type: 'hydrate',
        header: 'HTML Selector Parse',
        messageText: e
      });
    }
  }
}


function mergeInlinedStyles(doc: Document, styleElms: NodeListOf<HTMLStyleElement>) {
  const styleText: string[] = [];
  let styleElm: HTMLStyleElement;

  for (let i = styleElms.length - 1; i >= 0; i--) {
    // iterate backwards for funzies
    styleElm = styleElms[i];

    // collect up all the style text from each style element
    styleText.push(styleElm.innerHTML);

    // remove this style element from the document
    styleElm.remove();

    if (i === 0) {
      // this is the first style element, let's use this
      // same element as the main one we'll load up
      // merge all of the styles we collected into one
      const mergedStyles = styleText.reverse().join('').trim();

      if (mergedStyles.length > 0) {
        // let's keep the first style element
        // and make it the first element in the head
        doc.head.insertBefore(styleElm, doc.head.firstChild);
        return styleElm;
      }
    }
  }
  return null;
}
