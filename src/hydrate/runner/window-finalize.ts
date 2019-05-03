import * as d from '../../declarations';
import { relocateMetaCharset } from '../../compiler/html/relocate-meta-charset';
import { removeUnusedStyles } from '../../compiler/html/remove-unused-styles';
import { renderCatchError } from './render-utils';
import { updateCanonicalLink } from '../../compiler/html/canonical-link';


export function finalizeWindow(doc: Document, opts: d.HydrateDocumentOptions, results: d.HydrateResults) {
  if (opts.removeUnusedStyles !== false) {
    try {
      removeUnusedStyles(doc, results);
    } catch (e) {
      renderCatchError(results, e);
    }
  }

  if (typeof opts.title === 'string') {
    try {
      doc.title = opts.title;
    } catch (e) {
      renderCatchError(results, e);
    }
  }

  if (opts.removeScripts) {
    removeScripts(doc.documentElement);
  }

  try {
    updateCanonicalLink(doc, opts.canonicalUrl);
  } catch (e) {
    renderCatchError(results, e);
  }

  try {
    relocateMetaCharset(doc);
  } catch (e) {}

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
