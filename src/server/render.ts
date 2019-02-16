import * as d from '@declarations';
import { catchError } from '@utils';
import { connectElements } from './connect-elements';
import { generateHydrateResults, normalizeHydrateOptions } from './hydrate-utils';
import { MockDocument } from '@mock-doc';
import { optimizeHydratedDocument } from './optimize/optimize-hydrated-document';


export function renderToStringSync(html: string, opts: d.HydrateOptions = {}) {
  if (typeof html !== 'string') {
    throw new Error('Invalid html');
  }

  normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    const doc: Document = new MockDocument(html) as any;

    connectElements(opts, results, doc.documentElement);
    optimizeHydratedDocument(opts, results, doc);

    if (results.diagnostics.length === 0) {
      results.html = doc.documentElement.outerHTML;
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


export function hydrateDocumentSync(doc: Document, opts: d.HydrateOptions = {}) {
  if (doc == null || doc.documentElement == null || typeof doc.documentElement.nodeType !== 'number') {
    throw new Error('Invalid document');
  }

  normalizeHydrateOptions(opts);
  const results = generateHydrateResults(opts);

  try {
    connectElements(opts, results, doc.documentElement);
    optimizeHydratedDocument(opts, results, doc);

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}
