import * as d from '../declarations';
import { catchError } from '@utils';
import { URL } from 'url';


export function normalizeHydrateOptions(inputOpts: d.HydrateDocumentOptions) {
  const outputOpts: d.HydrateDocumentOptions = Object.assign({}, inputOpts);

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


export function generateHydrateResults(opts: d.HydrateDocumentOptions) {
  if (typeof opts.url !== 'string') {
    opts.url = `https://hydrate.stenciljs.com/`;
  }

  const hydrateResults: d.HydrateResults = {
    diagnostics: [],
    url: opts.url,
    host: null,
    hostname: null,
    href: null,
    port: null,
    pathname: null,
    search: null,
    hash: null,
    html: null,
    hydratedCount: 0,
    anchors: [],
    components: [],
    imgs: [],
    scripts: [],
    styles: [],
    title: null
  };

  try {
    const url = new URL(opts.url, `https://hydrate.stenciljs.com/`);
    hydrateResults.url = url.href;
    hydrateResults.host = url.host;
    hydrateResults.hostname = url.hostname;
    hydrateResults.href = url.href;
    hydrateResults.port = url.port;
    hydrateResults.pathname = url.pathname;
    hydrateResults.search = url.search;
    hydrateResults.hash = url.hash;

  } catch (e) {
    catchError(hydrateResults.diagnostics, e);
  }

  return hydrateResults;
}


export function renderError(results: d.HydrateResults, e: any) {
  const diagnostic = catchError(results.diagnostics, e);
  diagnostic.header = `Hydrate Error`;
  if (typeof results.pathname === 'string') {
    diagnostic.header += `: ${results.pathname}`;
  }
}
