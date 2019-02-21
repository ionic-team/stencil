import * as d from '@declarations';
import { logger } from '@sys';
import { URL } from 'url';


export function normalizePrerenderPath(config: d.Config, outputTarget: d.OutputTargetWww, windowLocationHref: string, inputPath: string) {
  let normalizedPath: string = null;
  const prodMode = (!config.devMode && config.logLevel !== 'debug');

  try {
    if (typeof inputPath !== 'string') {
      return null;
    }

    // parse the window.location
    const windowLocationUrl = new URL(windowLocationHref);

    // remove any quotes that somehow got in the href
    inputPath = inputPath.replace(/\'|\"/g, '');

    // parse the <a href> passed in
    const hrefParseUrl = new URL(inputPath, windowLocationHref);

    // don't bother for basically empty <a> tags
    if (hrefParseUrl.pathname == null) {
      return null;
    }

    // urls must be on the same host
    // but only check they're the same host when the href has a host
    if (hrefParseUrl.hostname != null && hrefParseUrl.hostname !== windowLocationUrl.hostname) {
      return null;
    }

    // convert it back to a nice in pretty path
    normalizedPath = hrefParseUrl.pathname;

    if (normalizedPath.startsWith(outputTarget.baseUrl) === false) {
      if (normalizedPath !== outputTarget.baseUrl.substr(0, outputTarget.baseUrl.length - 1)) {
        return null;
      }
    }

    const filter = (typeof outputTarget.prerenderFilter === 'function') ? outputTarget.prerenderFilter : prerenderFilter;
    const isValidUrl = filter(hrefParseUrl);
    if (!isValidUrl) {
      return null;
    }

    if (typeof outputTarget.prerenderPathQuery === 'function' && typeof hrefParseUrl.search === 'string') {
      const doPathQuery = outputTarget.prerenderPathQuery(hrefParseUrl, prodMode);
      if (doPathQuery) {
        normalizedPath += hrefParseUrl.search;
      }
    }

    if (typeof outputTarget.prerenderPathHash === 'function' && typeof hrefParseUrl.hash === 'string') {
      const doPathHash = outputTarget.prerenderPathHash(hrefParseUrl, prodMode);
      if (doPathHash) {
        normalizedPath += hrefParseUrl.hash;
      }
    }

  } catch (e) {
    logger.error(`normalizePrerenderPath`, e);
    return null;
  }

  return normalizedPath;
}


function prerenderFilter(url: URL) {
  const parts = url.pathname.split('/');
  const basename = parts[parts.length - 1];
  return !basename.includes('.');
}
