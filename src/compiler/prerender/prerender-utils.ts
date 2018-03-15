import * as d from '../../declarations';
import { pathJoin } from '../util';


export function normalizePrerenderLocation(config: d.Config, outputTarget: d.OutputTargetWww, windowLocationHref: string, href: string) {
  let prerenderLocation: d.PrerenderLocation = null;

  try {
    if (typeof href !== 'string') {
      return null;
    }

    // remove any quotes that somehow got in the href
    href = href.replace(/\'|\"/g, '');

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

    if (!outputTarget.prerenderPathQuery) {
      normalizedUrl.search = null;
    }

    prerenderLocation.url = config.sys.url.format(normalizedUrl);
    prerenderLocation.path = config.sys.url.parse(prerenderLocation.url).path;

    if (!prerenderLocation.path.startsWith(outputTarget.baseUrl)) {
      if (prerenderLocation.path !== outputTarget.baseUrl.substr(0, outputTarget.baseUrl.length - 1)) {
        return null;
      }
    }

    const filter = (typeof outputTarget.prerenderFilter === 'function') ? outputTarget.prerenderFilter : prerenderFilter;
    const isValidUrl = filter(hrefParseUrl);
    if (!isValidUrl) {
      return null;
    }

    if (hrefParseUrl.hash && outputTarget.prerenderPathHash) {
      prerenderLocation.url += hrefParseUrl.hash;
      prerenderLocation.path += hrefParseUrl.hash;
    }

  } catch (e) {
    config.logger.error(`normalizePrerenderLocation`, e);
    return null;
  }

  return prerenderLocation;
}


function prerenderFilter(url: d.Url) {
  const parts = url.pathname.split('/');
  const basename = parts[parts.length - 1];
  return !basename.includes('.');
}


export function crawlAnchorsForNextUrls(config: d.Config, outputTarget: d.OutputTargetWww, prerenderQueue: d.PrerenderLocation[], windowLocationHref: string, anchors: d.HydrateAnchor[]) {
  anchors && anchors.forEach(anchor => {
    addLocationToProcess(config, outputTarget, windowLocationHref, prerenderQueue, anchor.href);
  });
}


function addLocationToProcess(config: d.Config, outputTarget: d.OutputTargetWww, windowLocationHref: string, prerenderQueue: d.PrerenderLocation[], locationUrl: string) {
  const prerenderLocation = normalizePrerenderLocation(config, outputTarget, windowLocationHref, locationUrl);

  if (!prerenderLocation || prerenderQueue.some(p => p.url === prerenderLocation.url)) {
    // either it's not a good location to prerender
    // or we've already got it in the queue
    return;
  }

  // set that this location is pending to be prerendered
  prerenderLocation.status = 'pending';

  // add this to our queue of locations to prerender
  prerenderQueue.push(prerenderLocation);
}


export function getPrerenderQueue(config: d.Config, outputTarget: d.OutputTargetWww) {
  const prerenderHost = `http://prerender.stenciljs.com`;

  const prerenderQueue: d.PrerenderLocation[] = [];

  if (Array.isArray(outputTarget.prerenderLocations)) {
    outputTarget.prerenderLocations.forEach(prerenderLocation => {
      addLocationToProcess(config, outputTarget, prerenderHost, prerenderQueue, prerenderLocation.path);
    });
  }

  return prerenderQueue;
}


export function getWritePathFromUrl(config: d.Config, outputTarget: d.OutputTargetWww, url: string) {
  const parsedUrl = config.sys.url.parse(url);

  let pathName = parsedUrl.pathname;
  if (pathName.startsWith(outputTarget.baseUrl)) {
    pathName = pathName.substring(outputTarget.baseUrl.length);
  }

  // figure out the directory where this file will be saved
  const dir = config.sys.path.join(
    outputTarget.dir,
    pathName
  );

  // create the full path where this will be saved (normalize for windowz)
  return pathJoin(config, dir, `index.html`);
}
