import * as d from '../../declarations';
import { buildError } from '@utils';
import { normalizeHref } from './prerender-config';
import { URL } from 'url';


export function initializePrerenderEntryUrls(manager: d.PrerenderManager) {
  const entryHrefs: string[] = [];

  if (Array.isArray(manager.prerenderConfig.entryUrls)) {
    manager.prerenderConfig.entryUrls.forEach(entryUrl => {
      entryHrefs.push(entryUrl);
    });

  } else {
    entryHrefs.push(manager.outputTarget.baseUrl);
  }

  entryHrefs.forEach(href => {
    try {
      new URL(href);
      const url = manager.prerenderConfig.normalizeUrl(href);
      const normalizesHref = normalizeHref(manager.prerenderConfig, manager.diagnostics, url);
      addUrlToPendingQueue(manager, normalizesHref, '#entryUrl');

    } catch (e) {
      const diagnostic = buildError(manager.diagnostics);
      diagnostic.header = `Invalid Prerender Entry Url: ${href}`;
      diagnostic.messageText = `Entry Urls must include the protocol and domain of the site being prerendered.`;
    }
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
