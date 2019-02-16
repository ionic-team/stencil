import * as d from '@declarations';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { optimizeStyles } from './optimize-styles';
import { relocateMetaCharset } from './relocate-meta-charset';
import { updateCanonicalLink } from './canonical-link';


export async function optimizeHydratedDocument(opts: d.HydrateOptions, results: d.HydrateResults, doc: Document) {

  optimizeStyles(opts, results, doc);

  if (opts.collapseWhitespace) {
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

  if (typeof opts.canonicalLinkHref === 'function') {
    try {
      updateCanonicalLink(doc, opts);

    } catch (e) {
      results.diagnostics.push({
        level: 'warn',
        type: 'hydrate',
        header: 'Insert Canonical Link',
        messageText: e
      });
    }
  }

  if (opts.relocateMetaCharset !== false) {
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
}
