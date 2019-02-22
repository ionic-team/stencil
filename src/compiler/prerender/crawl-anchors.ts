import * as d from '../../declarations';


export function crawlAnchorsForNextUrls(prerenderConfig: d.HydrateConfig, windowLocationUrl: URL, parsedAnchors: d.HydrateAnchorElement[]) {
  const anchorUrls: string[] = [];

  if (Array.isArray(parsedAnchors) === true) {
    parsedAnchors.forEach(parsedAnchor => {
      const href = getCrawlableHref(prerenderConfig, windowLocationUrl, parsedAnchor);
      if (typeof href === 'string') {
        if (!anchorUrls.includes(href)) {
          anchorUrls.push(href);
        }
      }
    });
  }

  return anchorUrls;
}


function getCrawlableHref(prerenderConfig: d.HydrateConfig, windowLocationUrl: URL, anchor: d.HydrateAnchorElement) {
  if (anchor == null) {
    return null;
  }

  if (typeof anchor.target === 'string' && anchor.target.trim().toLowerCase() !== '_self') {
    return null;
  }

  const href = anchor.href;
  if (typeof href !== 'string') {
    return null;
  }

  const url = new URL(href, windowLocationUrl.href);
  if (url.hostname != null && windowLocationUrl.hostname != null && url.hostname !== windowLocationUrl.hostname) {
    return null;
  }

  const isValid = prerenderConfig.filterUrl(url, windowLocationUrl);
  if (!isValid) {
    return null;
  }

  return prerenderConfig.normalizeUrl(url, windowLocationUrl);
}
