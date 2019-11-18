import * as d from '../../declarations';
import { renderCatchError } from './render-utils';
import { constrainTimeouts } from '@mock-doc';


export function initializeWindow(win: Window, opts: d.HydrateDocumentOptions, results: d.HydrateResults) {
  try {
    win.location.href = opts.url;
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
      win.document.cookie = opts.cookie;
    } catch (e) {}
  }
  if (typeof opts.referrer === 'string') {
    try {
      (win.document as any).referrer = opts.referrer;
    } catch (e) {}
  }
  if (typeof opts.direction === 'string') {
    try {
      win.document.documentElement.setAttribute('dir', opts.direction);
    } catch (e) {}
  }
  if (typeof opts.language === 'string') {
    try {
      win.document.documentElement.setAttribute('lang', opts.language);
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
      renderCatchError(results, [...arguments].join(', '));
    };

    win.console.debug = function() {
      const diagnostic = renderCatchError(results, [...arguments].join(', '));
      diagnostic.level = 'debug';
      diagnostic.messageText = 'Hydrate Debug';
    };

  } catch (e) {
    renderCatchError(results, e);
  }

  return win;
}
