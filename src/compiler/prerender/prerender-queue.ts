import * as d from '@declarations';
import { URL } from 'url';


export function initializePrerenderEntryUrls(manager: d.PrerenderManager) {
  const prerenderUrl = new URL(PRERENDER_HOST);

  if (Array.isArray(manager.prerenderConfig.entryUrls) === true) {
    manager.prerenderConfig.entryUrls.forEach(entryUrl => {
      const url = manager.prerenderConfig.normalizeUrl(new URL(entryUrl, PRERENDER_HOST), prerenderUrl);
      addUrlToPendingQueue(manager, url);
    });

  } else {
    const baseUrl = new URL(manager.outputTarget.baseUrl, PRERENDER_HOST);
    const url = manager.prerenderConfig.normalizeUrl(baseUrl, prerenderUrl);
    addUrlToPendingQueue(manager, url);
  }
}


export function addUrlToPendingQueue(manager: d.PrerenderManager, url: string) {
  if (manager.urlsPending.has(url) === true) {
    return;
  }

  if (manager.urlsProcessing.has(url) === true) {
    return;
  }

  if (manager.urlsCompleted.has(url) === true) {
    return;
  }

  manager.urlsPending.add(url);
}


export const PRERENDER_HOST = `http://prerender.stenciljs.com`;
