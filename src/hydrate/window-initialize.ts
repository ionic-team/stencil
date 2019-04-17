import * as d from '../declarations';
import { constrainTimeouts } from '@mock-doc';
import globalScripts from '@global-scripts';
import { renderError } from './render-utils';


export async function initializeWindow(win: Window, doc: Document, opts: d.HydrateOptions, results: d.HydrateResults) {
  const url = (typeof opts.url === 'string' && opts.url.trim().length > 0) ? opts.url.trim() : '/';

  try {
    const parsedUrl = new URL(url, BASE_URL);
    win.location.href = parsedUrl.href;
  } catch (e) {
    renderError(results, e);
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
  if (typeof opts.beforeHydrate === 'function') {
    try {
      await opts.beforeHydrate(win, opts);
    } catch (e) {
      renderError(results, e);
    }
  }

  try {
    win.customElements = null;
  } catch (e) {}

  try {
    globalScripts(win, true);
  } catch (e) {
    renderError(results, e);
  }

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

  } catch (e) {
    renderError(results, e);
  }
}


const BASE_URL = 'http://hydrate.stenciljs.com';
