import * as d from '../declarations';
import { catchError } from '@utils';
import { constrainTimeouts } from '@mock-doc';
import globalScripts from '@global-scripts';


export function initializeWindow(results: d.HydrateResults, win: Window, doc: Document, opts: d.HydrateOptions) {
  const windowLocationUrl = setWindowUrl(win, opts);

  if (typeof opts.url === 'string') {
    try {
      win.location.href = opts.url;
    } catch (e) {}
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
      opts.beforeHydrate(doc as any, windowLocationUrl);
    } catch (e) {
      catchError(results.diagnostics, e);
    }
  }

  try {
    globalScripts(win, true);
  } catch (e) {
    catchError(results.diagnostics, e);
  }

  if (opts.constrainTimeouts) {
    constrainTimeouts(win);
  }

  return windowLocationUrl;
}


function setWindowUrl(win: Window, opts: d.HydrateOptions) {
  const url = typeof opts.url === 'string' ? opts.url : BASE_URL;
  try {
    win.location.href = url;
  } catch (e) {}
  return new URL(url, BASE_URL);
}

const BASE_URL = 'http://prerender.stenciljs.com';
