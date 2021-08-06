import type * as d from '../../declarations';
import { constrainTimeouts } from '@stencil/core/mock-doc';
import { renderCatchError } from './render-utils';
import { runtimeLogging } from './runtime-log';

export function initializeWindow(
  win: Window & typeof globalThis,
  doc: Document,
  opts: d.HydrateDocumentOptions,
  results: d.HydrateResults
) {
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
  if (typeof opts.buildId === 'string') {
    try {
      doc.documentElement.setAttribute('data-stencil-build', opts.buildId);
    } catch (e) {}
  }

  try {
    win.customElements = null;
  } catch (e) {}

  if (opts.constrainTimeouts) {
    constrainTimeouts(win);
  }

  runtimeLogging(win, opts, results);

  return win;
}
