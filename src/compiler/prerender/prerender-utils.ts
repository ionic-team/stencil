import { Config, HydrateResults, PrerenderConfig } from '../../declarations';
import { DEFAULT_PRERENDER_HOST } from './validate-prerender-config';


export function normalizePrerenderLocation(config: Config, windowLocationHref: string, href: string) {
  const prerenderConfig = config && config.prerender as PrerenderConfig;
  let prerenderLocation: PrerenderLocation = null;

  try {
    if (typeof href !== 'string') {
      return null;
    }

    // parse the <a href> passed in
    const hrefParseUrl = config.sys.url.parse(href);

    // don't bother for basically empty <a> tags
    if (!hrefParseUrl.pathname) {
      return null;
    }

    // parse the window.location
    const windowLocationUrl = config.sys.url.parse(windowLocationHref);

    // urls must be on the same host
    // but only check they're the same host when the href has a host
    if (hrefParseUrl.hostname && hrefParseUrl.hostname !== windowLocationUrl.hostname) {
      return null;
    }

    // convert it back to a nice in pretty path
    prerenderLocation = {
      url: config.sys.url.resolve(windowLocationHref, href)
    };

    const normalizedUrl = config.sys.url.parse(prerenderLocation.url);
    normalizedUrl.hash = null;

    if (!prerenderConfig || !prerenderConfig.includePathQuery) {
      normalizedUrl.search = null;
    }

    prerenderLocation.url = config.sys.url.format(normalizedUrl);
    prerenderLocation.path = config.sys.url.parse(prerenderLocation.url).path;

    if (hrefParseUrl.hash && prerenderConfig && prerenderConfig.includePathHash) {
      prerenderLocation.url += hrefParseUrl.hash;
      prerenderLocation.path += hrefParseUrl.hash;
    }

  } catch (e) {
    config.logger.error(`normalizePrerenderLocation: ${e}`);
    return null;
  }

  return prerenderLocation;
}


export function crawlAnchorsForNextUrls(config: Config, prerenderQueue: PrerenderLocation[], results: HydrateResults) {
  results.anchors && results.anchors.forEach(anchor => {
    addLocationToProcess(config, results.url, prerenderQueue, anchor.href);
  });
}


function addLocationToProcess(config: Config, windowLocationHref: string, prerenderQueue: PrerenderLocation[], locationUrl: string) {
  const prerenderLocation = normalizePrerenderLocation(config, windowLocationHref, locationUrl);

  if (!prerenderLocation || prerenderQueue.some(p => p.url === prerenderLocation.url)) {
    // either it's not a good location to prerender
    // or we've already got it in the queue
    return;
  }

  // set that this location is pending to be prerendered
  prerenderLocation.status = PrerenderStatus.pending;

  // add this to our queue of locations to prerender
  prerenderQueue.push(prerenderLocation);
}


export function getPrerenderQueue(config: Config) {
  const prerenderHost = `http://${DEFAULT_PRERENDER_HOST}`;

  const prerenderQueue: PrerenderLocation[] = [];
  const prerenderConfig = config.prerender as PrerenderConfig;

  if (Array.isArray(prerenderConfig.include)) {
    prerenderConfig.include.forEach(prerenderUrl => {
      addLocationToProcess(config, prerenderHost, prerenderQueue, prerenderUrl.path);
    });
  }

  return prerenderQueue;
}


export interface PrerenderLocation {
  url?: string;
  path?: string;
  status?: PrerenderStatus;
}


export enum PrerenderStatus {
  pending = 1,
  processing = 2,
  complete = 3
}
