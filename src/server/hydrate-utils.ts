import * as d from '@declarations';
import { URL } from 'url';


export function normalizeHydrateOptions(opts: d.HydrateOptions) {
  const req = opts.req;
  if (req && typeof req.get === 'function') {
    // assuming node express request object
    // https://expressjs.com/
    if (!opts.url) opts.url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (!opts.referrer) opts.referrer = req.get('referrer');
    if (!opts.userAgent) opts.userAgent = req.get('user-agent');
    if (!opts.cookie) opts.cookie = req.get('cookie');
  }
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
    query: urlParse.search,
    hash: urlParse.hash,
    html: null,
    styles: null,
    anchors: opts.collectAnchors ? [] : null,
    components: opts.collectComponents ? [] : null,
    styleUrls: opts.collectScriptUrls ? [] : null,
    scriptUrls: opts.collectStylesheetUrls ? [] : null,
    imgUrls: opts.collectImgUrls ? [] : null
  };

  return hydrateResults;
}


export function collectAnchors(doc: Document, results: d.HydrateResults) {
  const anchorElements = doc.querySelectorAll('a');

  for (var i = 0; i < anchorElements.length; i++) {
    const attrs: d.HydrateAnchor = {};
    const anchorAttrs = anchorElements[i].attributes;

    for (var j = 0; j < anchorAttrs.length; j++) {
      attrs[anchorAttrs[j].nodeName.toLowerCase()] = anchorAttrs[j].nodeValue;
    }

    results.anchors.push(attrs);
  }
}
