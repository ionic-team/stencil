import * as d from '../../declarations';
import { URL } from 'url';


export function initializePrerenderEntryUrls(manager: d.PrerenderManager) {
  const hostUrl = new URL(manager.origin);
  manager.origin = hostUrl.origin;
  manager.config.logger.debug(`prerender http origin: ${manager.origin}`);

  if (Array.isArray(manager.prerenderConfig.entryUrls) === true) {
    manager.prerenderConfig.entryUrls.forEach(entryUrl => {
      const url = manager.prerenderConfig.normalizeUrl(new URL(entryUrl, manager.origin), hostUrl);
      addUrlToPendingQueue(manager, url, '#entryUrls');
    });

  } else {
    const baseUrl = new URL(manager.outputTarget.baseUrl, manager.origin);
    const url = manager.prerenderConfig.normalizeUrl(baseUrl, hostUrl);
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
