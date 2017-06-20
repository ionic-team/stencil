import { ActiveSelectors } from './active-selectors';
import { parseCss } from './parse-css';
import { StringifyCss } from './stringify-css';


export function removeUnusedCss(elm: Element, css: string) {
  const activeSelectors = new ActiveSelectors(elm);

  let cssAst = parseCss(css);

  var stringify = new StringifyCss(activeSelectors);

  return stringify.compile(cssAst);
}

