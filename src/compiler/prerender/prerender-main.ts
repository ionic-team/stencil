import * as d from '../../declarations';
import { addUrlToPendingQueue, initializePrerenderEntryUrls } from './prerender-queue';
import { catchError, hasError } from '@utils';
import { getPrerenderConfig } from './prerender-config';
import { getWriteFilePathFromUrlPath } from './prerendered-write-path';


export async function runPrerenderMain(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, templateHtml: string) {
  // main thread!
  if (buildCtx.shouldAbort) {
    return;
  }

  // keep track of how long the entire build process takes
  const timeSpan = buildCtx.createTimeSpan(`prerendering started`);

  const prerenderDiagnostics: d.Diagnostic[] = [];

  try {
    // get the prerender urls to queue up
    const manager: d.PrerenderManager = {
      templateId: null,
      diagnostics: prerenderDiagnostics,
      config: config,
      compilerCtx: compilerCtx,
      origin: config.devServer.browserUrl,
      hydrateAppFilePath: buildCtx.hydrateAppFilePath,
      isDebug: (config.logLevel === 'debug'),
      logCount: 0,
      outputTarget: outputTarget,
      prerenderConfig: getPrerenderConfig(prerenderDiagnostics, outputTarget.prerenderConfig),
      prerenderConfigPath: outputTarget.prerenderConfig,
      prodMode: (!config.devMode && config.logLevel !== 'debug'),
      urlsCompleted: new Set(),
      urlsPending: new Set(),
      urlsProcessing: new Set(),
      resolve: null
    };

    initializePrerenderEntryUrls(manager);

    if (manager.urlsPending.size === 0) {
      timeSpan.finish(`prerendering failed: no urls found in the prerender config`);
      return;
    }

    manager.templateId = await createPrerenderTemplate(config, templateHtml);

    await new Promise(resolve => {
      manager.resolve = resolve;

      config.sys.nextTick(() => {
        drainPrerenderQueue(manager);
      });
    });

    const totalDuration = timeSpan.finish(`prerendering finished`);

    const totalUrls = manager.urlsCompleted.size;
    if (totalUrls > 1) {
      const average = Math.round(totalDuration / totalUrls);
      config.logger.info(`prerendered ${totalUrls} urls, averaging ${average} ms per url`);
    }

  } catch (e) {
    catchError(prerenderDiagnostics, e);
  }

  if (hasError(prerenderDiagnostics)) {
    config.logger.printDiagnostics(prerenderDiagnostics, config.rootDir);
    timeSpan.finish(`prerendering failed`);
  }
}


function drainPrerenderQueue(manager: d.PrerenderManager) {
  manager.urlsPending.forEach(url => {
    // remove from pending
    manager.urlsPending.delete(url);

    // move to processing
    manager.urlsProcessing.add(url);

    // kick off async prerendering
    prerenderUrl(manager, url);
  });

  if (manager.urlsProcessing.size === 0) {
    if (typeof manager.resolve === 'function') {
      // we're not actively processing anything
      // and there aren't anymore urls in the queue to be prerendered
      // so looks like our job here is done, good work team
      manager.resolve();
      manager.resolve = null;
    }

  } else {
    const counter = 50;
    const urlsCompletedSize = manager.urlsCompleted.size;
    if (urlsCompletedSize >= (manager.logCount + counter)) {
      manager.logCount = Math.floor(urlsCompletedSize / counter) * counter;
      manager.config.logger.info(`prerendered ${manager.logCount} urls ${manager.config.logger.dim(`...`)}`);
    }
  }
}


async function prerenderUrl(manager: d.PrerenderManager, url: string) {
  try {
    let timespan: d.LoggerTimeSpan;
    if (manager.isDebug) {
      const pathname = new URL(url).pathname;
      timespan = manager.config.logger.createTimeSpan(`prerender start: ${pathname}`, true);
    }

    const prerenderRequest: d.PrerenderRequest = {
      hydrateAppFilePath: manager.hydrateAppFilePath,
      prerenderConfigPath: manager.prerenderConfigPath,
      templateId: manager.templateId,
      writeToFilePath: getWriteFilePathFromUrlPath(manager, url),
      url: url
    };

    // prender this path and wait on the results
    const results = await manager.config.sys.prerenderUrl(prerenderRequest);

    if (manager.isDebug) {
      const pathname = new URL(url).pathname;
      const filePath = manager.config.sys.path.relative(manager.config.rootDir, results.filePath);
      timespan.finish(`prerender finish: ${pathname}, ${filePath}`);
    }

    manager.diagnostics.push(...results.diagnostics);

    if (Array.isArray(results.anchorUrls) === true) {
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

  // let's try to drain the queue again and let this
  // next call figure out if we're actually done or not
  manager.config.sys.nextTick(() => {
    drainPrerenderQueue(manager);
  });
}


async function createPrerenderTemplate(config: d.Config, templateHtml: string) {
  const templateFileName = `prerender-template-${config.sys.generateContentHash(templateHtml, 12)}.html`;
  const templateId = config.sys.path.join(config.sys.details.tmpDir, templateFileName);
  await config.sys.fs.writeFile(templateId, templateHtml);
  return templateId;
}
