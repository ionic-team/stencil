import { constrainTimeouts, type MockWindow } from '@stencil/core/mock-doc';
import { HYDRATE_HOST_ID } from 'src/runtime/runtime-constants';

import type * as d from '../../declarations';
import { runtimeLogging } from './runtime-log';

let uniqueHostId = 0;

export function initializeWindow(
  win: MockWindow,
  doc: d.StencilDocument,
  opts: d.HydrateDocumentOptions,
  results: d.HydrateResults,
) {
  if (typeof opts.url === 'string') {
    try {
      win.location.href = opts.url;
    } catch (e) {}
  }

  if (typeof opts.userAgent === 'string') {
    try {
      win.navigator.userAgent = opts.userAgent;
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
    // TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
    // @ts-ignore
    win.customElements = null;
  } catch (e) {}

  if (opts.constrainTimeouts) {
    constrainTimeouts(win);
  }

  runtimeLogging(win, opts, results);

  /**
   * apply the hydrate host id so that 
   */
  doc[HYDRATE_HOST_ID] = uniqueHostId++;

  return win;
}
