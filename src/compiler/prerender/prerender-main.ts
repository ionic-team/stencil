import * as d from '@declarations';
import { buildWarn, catchError, hasError } from '@utils';
import { getWriteFilePathFromUrlPath as getWriteFilePathFromUrlPath } from './prerendered-write-path';
import { PRERENDER_HOST, addUrlPathToPending, addUrlPathsFromOutputTarget } from './prerender-queue';
import { sys } from '@sys';


export async function runPrerenderMain(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, templateHtml: string) {
  // main thread!
  if (buildCtx.shouldAbort) {
    return;
  }

  // keep track of how long the entire build process takes
  const timeSpan = buildCtx.createTimeSpan(`prerendering started`);

  try {
    // get the prerender urls to queue up
    const instructions: d.PrerenderInstructions = {
      templateId: null,
      config: config,
      compilerCtx: compilerCtx,
      buildCtx: buildCtx,
      outputTarget: outputTarget,
      pathsCompleted: new Set(),
      pathsPending: new Set(),
      pathsProcessing: new Set(),
      resolve: null
    };
    addUrlPathsFromOutputTarget(instructions);

    if (instructions.pathsPending.size === 0) {
      const d = buildWarn(buildCtx.diagnostics);
      d.messageText = `No urls found in the prerender config`;
      return;
    }

    instructions.templateId = await createPrerenderTemplate(templateHtml);

    await new Promise(resolve => {
      instructions.resolve = resolve;
      drainPrerenderQueue(instructions);
    });

    timeSpan.finish(`prerendered paths: ${instructions.pathsCompleted.size}`);

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


function drainPrerenderQueue(instructions: d.PrerenderInstructions) {
  instructions.pathsPending.forEach(p => {
    // move to processing
    instructions.pathsProcessing.add(p);

    // remove from pending
    instructions.pathsPending.delete(p);

    prerenderPath(instructions, p);
  });

  if (instructions.pathsProcessing.size === 0) {
    // we're not actively processing anything
    // and there aren't anymore urls in the queue to be prerendered
    // so looks like our job here is done, good work team
    instructions.resolve();
  }
}


async function prerenderPath(instructions: d.PrerenderInstructions, p: string) {
  const timeSpan = instructions.buildCtx.createTimeSpan(`prerender started: ${p}`);

  try {
    // prender this path and wait on the results
    const writeToFilePath = getWriteFilePathFromUrlPath(instructions.outputTarget, p);

    const url = PRERENDER_HOST + p;

    const hydrateOptions: d.HydrateOptions = {
      collapseWhitespace: !!instructions.outputTarget.collapseWhitespace,
      pretty: !!instructions.outputTarget.pretty,
      canonicalLinkHref: null,
      cookie: null,
      direction: null,
      headElements: null,
      language: null,
      referrer: null,
      removeUnusedStyles: !!instructions.outputTarget.removeUnusedStyles,
      title: null,
      url: url,
      userAgent: instructions.outputTarget.userAgent
    };

    if (instructions.config.devMode || instructions.config.logLevel === 'debug') {
      hydrateOptions.collapseWhitespace = false;
      hydrateOptions.pretty = true;
    }

    const results = await sys.prerenderUrl(
      instructions.buildCtx.hydrateAppFilePath,
      instructions.templateId,
      writeToFilePath,
      hydrateOptions
    );

    instructions.buildCtx.diagnostics.push(...results.diagnostics);

    if (instructions.outputTarget.prerenderUrlCrawl === true && Array.isArray(results.anchors) === true) {
      results.anchors.forEach(anchor => {
        addUrlPathToPending(instructions, results.url, anchor.href);
      });
    }

    timeSpan.finish(`prerender finished: ${p}`);

  } catch (e) {
    // darn, idk, bad news
    catchError(instructions.buildCtx.diagnostics, e);
    timeSpan.finish(`prerender failed: ${p}`);
  }

  instructions.pathsProcessing.delete(p);
  instructions.pathsCompleted.add(p);
  p = null;

  // let's try to drain the queue again and let this
  // next call figure out if we're actually done or not
  drainPrerenderQueue(instructions);
}


async function createPrerenderTemplate(templateHtml: string) {
  const templateFileName = `prerender-template-${sys.generateContentHash(templateHtml, 12)}.html`;
  const templateId = sys.path.join(sys.details.tmpDir, templateFileName);
  await sys.fs.writeFile(templateId, templateHtml);
  return templateId;
}
