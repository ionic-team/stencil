import { HydrateOptions } from '../../util/interfaces';
import { removeUnusedCss } from '../css/remove-unused-css';


export function optimizeDocument(doc: Document, css: string, opts: HydrateOptions) {

  if (css.length > 0) {
    const styleElm = doc.createElement('style');
    styleElm.innerHTML = opts.removeUnusedCss !== false ? removeUnusedCss(doc.documentElement, css) : css;
    doc.head.insertBefore(styleElm, doc.head.firstChild);
  }

}
