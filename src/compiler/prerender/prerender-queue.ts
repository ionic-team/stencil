import * as d from '../../declarations';
import { URL } from 'url';


export function initializePrerenderEntryUrls(manager: d.PrerenderManager) {
  const prerenderUrl = new URL(PRERENDER_HOST);

  if (Array.isArray(manager.prerenderConfig.entryUrls) === true) {
    manager.prerenderConfig.entryUrls.forEach(entryUrl => {
      const url = manager.prerenderConfig.normalizeUrl(new URL(entryUrl, PRERENDER_HOST), prerenderUrl);
      addUrlToPendingQueue(manager, url, '#entryUrls');
    });

  } else {
    const baseUrl = new URL(manager.outputTarget.baseUrl, PRERENDER_HOST);
    const url = manager.prerenderConfig.normalizeUrl(baseUrl, prerenderUrl);
    addUrlToPendingQueue(manager, url, '#baseUrl');
  }
}


export function addUrlToPendingQueue(manager: d.PrerenderManager, queueUrl: string, fromUrl: string) {
  if (manager.urlsPending.has(queueUrl) === true) {
    return;
  }

  if (manager.urlsProcessing.has(queueUrl) === true) {
    return;
  }

  if (manager.urlsCompleted.has(queueUrl) === true) {
    return;
  }

  manager.urlsPending.add(queueUrl);

  if (manager.isDebug) {
    const url = new URL(queueUrl).pathname;
    const from = fromUrl.startsWith('#') ? fromUrl : new URL(fromUrl).pathname;
    manager.config.logger.debug(`prerender queue: ${url} (from ${from})`);
  }
}


export const PRERENDER_HOST = `http://prerender.stenciljs.com`;
