import * as d from '@declarations';
import { addUrlToPendingQueue, initializePrerenderEntryUrls } from './prerender-queue';
import { buildWarn, catchError, hasError } from '@utils';
import { getPrerenderConfig } from './prerender-config';
import { getWriteFilePathFromUrlPath } from './prerendered-write-path';


export async function runPrerenderMain(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, templateHtml: string) {
  // main thread!
  if (buildCtx.shouldAbort) {
    return;
  }

  // keep track of how long the entire build process takes
  const timeSpan = buildCtx.createTimeSpan(`prerendering started`);

  try {
    // get the prerender urls to queue up
    const manager: d.PrerenderManager = {
      templateId: null,
      config: config,
      compilerCtx: compilerCtx,
      buildCtx: buildCtx,
      prerenderConfig: getPrerenderConfig(buildCtx.diagnostics, outputTarget.prerenderConfig),
      prerenderConfigPath: outputTarget.prerenderConfig,
      outputTarget: outputTarget,
      prodMode: (!config.devMode && config.logLevel !== 'debug'),
      urlsCompleted: new Set(),
      urlsPending: new Set(),
      urlsProcessing: new Set(),
      resolve: null
    };

    initializePrerenderEntryUrls(manager);

    if (manager.urlsPending.size === 0) {
      const d = buildWarn(buildCtx.diagnostics);
      d.messageText = `No urls found in the prerender config`;
      return;
    }

    manager.templateId = await createPrerenderTemplate(config, templateHtml);

    await new Promise(resolve => {
      manager.resolve = resolve;
      drainPrerenderQueue(manager);
    });

    timeSpan.finish(`prerendered paths: ${manager.urlsCompleted.size}`);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  if (hasError(buildCtx.diagnostics)) {
    timeSpan.finish(`prerendering failed`);
  }

  if (compilerCtx.localPrerenderServer) {
    compilerCtx.localPrerenderServer.close();
    delete compilerCtx.localPrerenderServer;
  }
}


function drainPrerenderQueue(manager: d.PrerenderManager) {
  manager.urlsPending.forEach(url => {
    // move to processing
    manager.urlsProcessing.add(url);

    // remove from pending
    manager.urlsPending.delete(url);

    prerenderUrl(manager, url);
  });

  if (manager.urlsProcessing.size === 0) {
    // we're not actively processing anything
    // and there aren't anymore urls in the queue to be prerendered
    // so looks like our job here is done, good work team
    manager.resolve();
  }
}


async function prerenderUrl(manager: d.PrerenderManager, url: string) {
  try {
    const prerenderRequest: d.PrerenderRequest = {
      hydrateAppFilePath: manager.buildCtx.hydrateAppFilePath,
      prerenderConfigPath: manager.prerenderConfigPath,
      templateId: manager.templateId,
      writeToFilePath: getWriteFilePathFromUrlPath(manager, url),
      url: url
    };

    // prender this path and wait on the results
    const results = await manager.config.sys.prerenderUrl(prerenderRequest);

    manager.buildCtx.diagnostics.push(...results.diagnostics);

    if (Array.isArray(results.anchorUrls) === true) {
      results.anchorUrls.forEach(anchorUrl => {
        addUrlToPendingQueue(manager, anchorUrl);
      });
    }

  } catch (e) {
    // darn, idk, bad news
    catchError(manager.buildCtx.diagnostics, e);
  }

  manager.urlsProcessing.delete(url);
  manager.urlsCompleted.add(url);
  url = null;

  // let's try to drain the queue again and let this
  // next call figure out if we're actually done or not
  drainPrerenderQueue(manager);
}


async function createPrerenderTemplate(config: d.Config, templateHtml: string) {
  const templateFileName = `prerender-template-${config.sys.generateContentHash(templateHtml, 12)}.html`;
  const templateId = config.sys.path.join(config.sys.details.tmpDir, templateFileName);
  await config.sys.fs.writeFile(templateId, templateHtml);
  return templateId;
}
