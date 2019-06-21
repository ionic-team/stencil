import * as d from '../../declarations';
import { constrainTimeouts } from '@mock-doc';
import { renderCatchError } from './render-utils';


export function initializeWindow(win: Window, doc: Document, opts: d.HydrateDocumentOptions, results: d.HydrateResults) {
  try {
    win.location.href = results.url;
  } catch (e) {
    renderCatchError(results, e);
  }

  if (typeof opts.userAgent === 'string') {
    try {
      (win.navigator as any).userAgent = opts.userAgent;
    } catch (e) {}
  }
  if (typeof opts.cookie === 'string') {
    try {
      doc.cookie = opts.cookie;
    } catch (e) {}
  }
  if (typeof opts.referrer === 'string') {
    try {
      (doc as any).referrer = opts.referrer;
    } catch (e) {}
  }
  if (typeof opts.direction === 'string') {
    try {
      doc.documentElement.setAttribute('dir', opts.direction);
    } catch (e) {}
  }
  if (typeof opts.language === 'string') {
    try {
      doc.documentElement.setAttribute('lang', opts.language);
    } catch (e) {}
  }

  try {
    win.customElements = null;
  } catch (e) {}

  if (opts.constrainTimeouts) {
    constrainTimeouts(win);
  }

  try {
    win.console.error = function() {

      const diagnostic: d.Diagnostic = {
        level: 'error',
        type: 'runtime',
        header: 'Hydrate Error',
        messageText: [...arguments].join(', '),
        relFilePath: null,
        absFilePath: null,
        lines: []
      };
      if (typeof results.pathname === 'string') {
        diagnostic.header += `: ${results.pathname}`;
      }
      results.diagnostics.push(diagnostic);
    };

    win.console.debug = function() {
      const diagnostic: d.Diagnostic = {
        level: 'debug',
        type: 'build',
        header: 'Hydrate Debug',
        messageText: [...arguments].join(', '),
        relFilePath: null,
        absFilePath: null,
        lines: []
      };
      if (typeof results.pathname === 'string') {
        diagnostic.header += `: ${results.pathname}`;
      }
      results.diagnostics.push(diagnostic);
    };

  } catch (e) {
    renderCatchError(results, e);
  }
}
