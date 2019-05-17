import * as d from '../../declarations';
import { buildError, catchError } from '@utils';
import { crawlAnchorsForNextUrls } from './crawl-urls';
import { getWriteFilePathFromUrlPath } from './prerendered-write-path';
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


function addUrlToPendingQueue(manager: d.PrerenderManager, queueUrl: string, fromUrl: string) {
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


export async function drainPrerenderQueue(manager: d.PrerenderManager) {
  const url = getNextUrl(manager);

  if (url != null) {
    // looks like we're ready to prerender more
    // remove from pending
    manager.urlsPending.delete(url);

    // move to processing
    manager.urlsProcessing.add(url);

    // kick off async prerendering
    prerenderUrl(manager, url);

    // could be more ready for prerendering
    // let's check again after a tick
    manager.config.sys.nextTick(() => {
      drainPrerenderQueue(manager);
    });
  }

  if (manager.urlsProcessing.size === 0) {
    if (typeof manager.resolve === 'function') {
      // we're not actively processing anything
      // and there aren't anymore urls in the queue to be prerendered
      // so looks like our job here is done, good work team
      manager.resolve();
      manager.resolve = null;
    }
  }
}


function getNextUrl(manager: d.PrerenderManager) {
  const next = manager.urlsPending.values().next();
  if (next.done) {
    // all emptied out, no more pending
    return null;
  }

  if (manager.urlsProcessing.size >= manager.maxConcurrency) {
    // slow it down there buddy, too many at one time
    return null;
  }

  return next.value;
}


async function prerenderUrl(manager: d.PrerenderManager, url: string) {
  let previewUrl = url;
  try {
    previewUrl = new URL(url).pathname;
    let timespan: d.LoggerTimeSpan;
    if (manager.isDebug) {
      timespan = manager.config.logger.createTimeSpan(`prerender start: ${previewUrl}`, true);
    }

    const prerenderRequest: d.PrerenderRequest = {
      baseUrl: manager.outputTarget.baseUrl,
      componentGraphPath: manager.componentGraphPath,
      devServerHostUrl: manager.devServerHostUrl,
      hydrateAppFilePath: manager.hydrateAppFilePath,
      prerenderConfigPath: manager.prerenderConfigPath,
      templateId: manager.templateId,
      url: url,
      writeToFilePath: getWriteFilePathFromUrlPath(manager, url)
    };

    // prender this path and wait on the results
    const results = await manager.config.sys.prerenderUrl(prerenderRequest);

    if (manager.isDebug) {
      const filePath = manager.config.sys.path.relative(manager.config.rootDir, results.filePath);
      const hasError = results.diagnostics.some(d => d.level === 'error');
      if (hasError) {
        timespan.finish(`prerender failed: ${previewUrl}, ${filePath}`, 'red');
      } else {
        timespan.finish(`prerender finish: ${previewUrl}, ${filePath}`);
      }
    }

    manager.diagnostics.push(...results.diagnostics);

    if (Array.isArray(results.anchorUrls)) {
      results.anchorUrls.forEach(anchorUrl => {
        addUrlToPendingQueue(manager, anchorUrl, url);
      });
    }

  } catch (e) {
    // darn, idk, bad news
    catchError(manager.diagnostics, e);
  }

  manager.urlsProcessing.delete(url);
  manager.urlsCompleted.add(url);

  const urlsCompletedSize = manager.urlsCompleted.size;
  if (manager.progressLogger && urlsCompletedSize > 1) {
    manager.progressLogger.update(`           prerendered ${urlsCompletedSize} urls: ${manager.config.sys.color.dim(previewUrl)}`);
  }
  // let's try to drain the queue again and let this
  // next call figure out if we're actually done or not
  manager.config.sys.nextTick(() => {
    drainPrerenderQueue(manager);
  });
}


