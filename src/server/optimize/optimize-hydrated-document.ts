import * as d from '@declarations';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { optimizeStyles } from './optimize-styles';
import { relocateMetaCharset } from './relocate-meta-charset';
import { updateCanonicalLink } from './canonical-link';


export async function optimizeHydratedDocument(opts: d.HydrateOptions, results: d.HydrateResults, doc: Document) {

  optimizeStyles(opts, results, doc);

  if (opts.collapseWhitespace === true) {
    try {
      collapseHtmlWhitepace(doc.documentElement);

    } catch (e) {
      results.diagnostics.push({
        level: 'warn',
        type: 'hydrate',
        header: 'Reduce HTML Whitespace',
        messageText: e
      });
    }
  }

  if (typeof opts.canonicalLink === 'string') {
    try {
      updateCanonicalLink(doc, opts.canonicalLink);

    } catch (e) {
      results.diagnostics.push({
        level: 'warn',
        type: 'hydrate',
        header: 'Insert Canonical Link',
        messageText: e
      });
    }
  }

  try {
    relocateMetaCharset(doc);

  } catch (e) {
    results.diagnostics.push({
      level: 'warn',
      type: 'hydrate',
      header: 'Relocate Meta Charset',
      messageText: e
    });
  }
}
