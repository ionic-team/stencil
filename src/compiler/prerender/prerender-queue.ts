import * as d from '../../declarations';
import { buildError } from '@utils';
import { crawlAnchorsForNextUrls } from './crawl-urls';
import { URL } from 'url';


export function initializePrerenderEntryUrls(manager: d.PrerenderManager) {
  const entryAnchors: d.HydrateAnchorElement[] = [];

  if (Array.isArray(manager.prerenderConfig.entryUrls)) {
    manager.prerenderConfig.entryUrls.forEach(entryUrl => {
      const entryAnchor: d.HydrateAnchorElement = {
        href: entryUrl
      };
      entryAnchors.push(entryAnchor);
    });

  } else {
    const entryAnchor: d.HydrateAnchorElement = {
      href: manager.outputTarget.baseUrl
    };
    entryAnchors.push(entryAnchor);
  }

  for (const entryAnchor of entryAnchors) {
    // ensure each entry url is valid
    // and has a domain
    try {
      new URL(entryAnchor.href);
    } catch (e) {
      const diagnostic = buildError(manager.diagnostics);
      diagnostic.header = `Invalid Prerender Entry Url: ${entryAnchor.href}`;
      diagnostic.messageText = `Entry Urls must include the protocol and domain of the site being prerendered.`;
      return;
    }
  }

  const base = new URL(manager.outputTarget.baseUrl);

  const hrefs = crawlAnchorsForNextUrls(manager.prerenderConfig, manager.diagnostics, base, base, entryAnchors);
  hrefs.forEach(href => {
    addUrlToPendingQueue(manager, href, '#entryUrl');
  });
}


export function addUrlToPendingQueue(manager: d.PrerenderManager, queueUrl: string, fromUrl: string) {
  if (typeof queueUrl !== 'string' || queueUrl === '') {
    return;
  }
  if (manager.urlsPending.has(queueUrl)) {
    return;
  }
  if (manager.urlsProcessing.has(queueUrl)) {
    return;
  }
  if (manager.urlsCompleted.has(queueUrl)) {
    return;
  }

  manager.urlsPending.add(queueUrl);

  if (manager.isDebug) {
    const url = new URL(queueUrl).pathname;
    const from = fromUrl.startsWith('#') ? fromUrl : new URL(fromUrl).pathname;
    manager.config.logger.debug(`prerender queue: ${url} (from ${from})`);
  }
}
