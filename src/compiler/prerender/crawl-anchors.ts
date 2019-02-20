import * as d from '@declarations';


export function crawlAnchorsForNextUrlPaths(parsedAnchors: d.HydrateAnchorElement[]) {
  const anchors: d.HydrateAnchorElement[] = [];

  if (Array.isArray(parsedAnchors) === true) {
    parsedAnchors.forEach(parsedAnchor => {
      const href = getCrawlableHref(parsedAnchor);

      if (typeof href === 'string') {
        if (!anchors.some(a => a.href === parsedAnchor.href)) {
          anchors.push({
            href: href
          });
        }
      }
    });
  }

  return anchors;
}


function getCrawlableHref(anchor: d.HydrateAnchorElement) {
  if (anchor == null || typeof anchor.href !== 'string') {
    return null;
  }

  if (typeof anchor.target === 'string' && anchor.target.trim().toLowerCase() !== '_self') {
    return null;
  }

  const href = anchor.href.replace(/\'|\"/g, '').trim();

  if (href === '' || href === '#') {
    return null;
  }

  return href;
}
