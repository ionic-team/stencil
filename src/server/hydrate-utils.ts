import * as d from '../declarations';
import { URL } from 'url';


export function normalizeHydrateOptions(inputOpts: d.HydrateOptions) {
  const outputOpts: d.HydrateOptions = Object.assign({}, inputOpts);

  if (typeof outputOpts.maxHydrateCount !== 'number') {
    outputOpts.maxHydrateCount = 300;
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
