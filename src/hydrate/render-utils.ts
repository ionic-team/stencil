import * as d from '../declarations';
import { catchError } from '@utils';
import { URL } from 'url';


export function normalizeHydrateOptions(inputOpts: d.HydrateOptions) {
  const outputOpts: d.HydrateOptions = Object.assign({}, inputOpts);

  if (typeof outputOpts.clientHydrateAnnotations !== 'boolean') {
    outputOpts.clientHydrateAnnotations = true;
  }

  if (typeof outputOpts.constrainTimeouts !== 'boolean') {
    outputOpts.constrainTimeouts = true;
  }

  if (typeof outputOpts.maxHydrateCount !== 'number') {
    outputOpts.maxHydrateCount = 300;
  }

  if (typeof outputOpts.timeout !== 'number') {
    outputOpts.timeout = 5000;
  }

  return outputOpts;
}


export function generateHydrateResults(opts: d.HydrateOptions) {
  if (typeof opts.url !== 'string') {
    opts.url = `https://hydrate.stenciljs.com/`;
  }

  let urlParse: URL;
  try {
    urlParse = new URL(opts.url);
  } catch (e) {
    urlParse = {} as any;
  }

  const hydrateResults: d.HydrateResults = {
    diagnostics: [],
    url: opts.url,
    host: urlParse.host,
    hostname: urlParse.hostname,
    port: urlParse.port,
    pathname: urlParse.pathname,
    search: urlParse.search,
    hash: urlParse.hash,
    html: null,
    hydratedCount: 0,
    anchors: opts.collectAnchors ? [] : null,
    components: opts.collectComponents ? [] : null,
    styles: opts.collectScripts ? [] : null,
    scripts: opts.collectStylesheets ? [] : null,
    imgs: opts.collectImgs ? [] : null,
    title: null
  };

  return hydrateResults;
}


export function renderError(results: d.HydrateResults, e: any) {
  const diagnostic = catchError(results.diagnostics, e);
  diagnostic.header = `Hydrate Error`;
  if (typeof results.pathname === 'string') {
    diagnostic.header += `: ${results.pathname}`;
  }
}
