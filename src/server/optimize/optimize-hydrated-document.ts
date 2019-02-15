import * as d from '@declarations';
import { collapseHtmlWhitepace } from './collapse-html-whitespace';
import { insertModulePreload } from './module-preload';
import { optimizeStyles } from './optimize-styles';
import { relocateMetaCharset } from './relocate-meta-charset';
import { updateCanonicalLink } from './canonical-link';


export async function optimizeHydratedDocument(
  opts: d.HydrateOptions,
  results: d.HydrateResults,
  doc: Document
) {

  if (opts.canonicalLink) {
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

  if (opts.inlineStyles !== false) {
    try {
      optimizeStyles(opts, results, doc);

    } catch (e) {
      results.diagnostics.push({
        level: 'warn',
        type: 'hydrate',
        header: 'Inline Component Styles',
        messageText: e
      });
    }
  }

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

  if (opts.insertModulePreload) {
    try {
      insertModulePreload(results, doc);

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
