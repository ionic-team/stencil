import * as d from '@declarations';
import { buildWarn, catchError, hasError } from '@utils';
import { getWriteFilePathFromUrlPath as getWriteFilePathFromUrlPath } from './prerendered-write-path';
import { PRERENDER_HOST, addUrlPathToPending, addUrlPathsFromOutputTarget } from './prerender-queue';
import { sys } from '@sys';
import { URL } from 'url';


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
    const url = new URL(p, PRERENDER_HOST);
    const prodMode = (!instructions.config.devMode && instructions.config.logLevel !== 'debug');

    // prender this path and wait on the results
    const results = await sys.prerenderUrl(
      instructions.buildCtx.hydrateAppFilePath,
      instructions.templateId,
      getWriteFilePathFromUrlPath(instructions.outputTarget, p),
      getHydrateOptions(instructions, url, prodMode)
    );

    instructions.buildCtx.diagnostics.push(...results.diagnostics);

    if (Array.isArray(results.anchors) === true) {
      let doUrlCrawl = true;
      if (typeof instructions.outputTarget.prerenderUrlCrawl === 'function') {
        doUrlCrawl = instructions.outputTarget.prerenderUrlCrawl(url, prodMode);
      }

      if (doUrlCrawl) {
        results.anchors.forEach(anchor => addUrlPathToPending(instructions, results.url, anchor.href));
      }
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


function getHydrateOptions(instructions: d.PrerenderInstructions, url: URL, prodMode: boolean) {
  const o = instructions.outputTarget;

  const hydrateOptions: d.HydrateOptions = {
    collapseWhitespace: typeof o.prerenderPrettyHtml === 'function' ? o.prerenderPrettyHtml(url, prodMode) : prodMode,
    canonicalLink: typeof o.prerenderCanonicalLink === 'function' ? o.prerenderCanonicalLink(url, prodMode) : undefined,
    cookie: typeof o.prerenderCookie === 'function' ? o.prerenderCookie(url, prodMode) : undefined,
    direction: typeof o.prerenderDirection === 'function' ? o.prerenderDirection(url, prodMode) : undefined,
    headElements: typeof o.prerenderHeadElements === 'function' ? o.prerenderHeadElements(url, prodMode) : undefined,
    language: typeof o.prerenderLanguage === 'function' ? o.prerenderLanguage(url, prodMode) : undefined,
    prettyHtml: typeof o.prerenderPrettyHtml === 'function' ? o.prerenderPrettyHtml(url, prodMode) : !prodMode,
    referrer: typeof o.prerenderReferrer === 'function' ? o.prerenderReferrer(url, prodMode) : undefined,
    removeUnusedStyles: true,
    title: typeof o.prerenderTitle === 'function' ? o.prerenderTitle(url, prodMode) : undefined,
    url: url.href,
    userAgent: typeof o.prerenderUserAgent === 'function' ? o.prerenderUserAgent(url, prodMode) : `stencil/prerender`,
  };

  return hydrateOptions;
}


async function createPrerenderTemplate(templateHtml: string) {
  const templateFileName = `prerender-template-${sys.generateContentHash(templateHtml, 12)}.html`;
  const templateId = sys.path.join(sys.details.tmpDir, templateFileName);
  await sys.fs.writeFile(templateId, templateHtml);
  return templateId;
}
