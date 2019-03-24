import * as d from '../declarations';
import { catchError } from '@utils';
import { collapseHtmlWhitepace } from '../compiler/html/collapse-html-whitespace';
import { optimizeStyles } from '../compiler/html/optimize-styles';
import { relocateMetaCharset } from '../compiler/html/relocate-meta-charset';
import { updateCanonicalLink } from '../compiler/html/canonical-link';


export function finalizeWindow(opts: d.HydrateOptions, results: d.HydrateResults, windowLocationUrl: URL, doc: Document) {
  optimizeStyles(doc, opts, results);

  if (typeof opts.title === 'string') {
    try {
      doc.title = opts.title;
    } catch (e) {}
  }

  if (opts.removeScripts) {
    removeScripts(doc.documentElement);
  }

  if (opts.collapseWhitespace) {
    try {
      collapseHtmlWhitepace(doc.documentElement);
    } catch (e) {}
  }

  if (typeof opts.canonicalLink === 'string') {
    try {
      updateCanonicalLink(doc, opts.canonicalLink);
    } catch (e) {}
  }

  try {
    relocateMetaCharset(doc);
  } catch (e) {}

  if (typeof opts.afterHydrate === 'function') {
    try {
      opts.afterHydrate(doc as any, windowLocationUrl);
    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }

  if (opts.clientHydrateAnnotations) {
    doc.documentElement.classList.add('hydrated');
  }

  results.title = doc.title;
}


function removeScripts(elm: HTMLElement) {
  const children = elm.children;
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    removeScripts(child as any);

    if (child.nodeName === 'SCRIPT') {
      child.remove();
    }
  }
}
