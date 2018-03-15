import * as d from '../../declarations';
import { buildWarn, catchError, hasError } from '../util';
import { crawlAnchorsForNextUrls, getPrerenderQueue, getWritePathFromUrl } from './prerender-utils';
import { generateHostConfig } from './host-config';
import { optimizeIndexHtml } from '../html/optimize-html';
import { prerenderPath } from './prerender-path';


export async function prerenderOutputTargets(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (!config.srcIndexHtml) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => {
    return o.type === 'www' && o.indexHtml;
  });

  await Promise.all(outputTargets.map(async outputTarget => {

    if (outputTarget.hydrateComponents && outputTarget.prerenderLocations && outputTarget.prerenderLocations.length > 0) {
      await prerenderOutputTarget(config, compilerCtx, buildCtx, outputTarget, entryModules);

    } else {
      const windowLocationPath = outputTarget.baseUrl;
      await optimizeIndexHtml(config, compilerCtx, outputTarget, windowLocationPath, buildCtx.diagnostics);
    }

  }));
}


async function prerenderOutputTarget(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[]) {
  // if there was src index.html file, then the process before this one
  // would have already loaded and updated the src index to its www path
  // get the www index html content for the template for all prerendered pages
  let indexHtml: string = null;
  try {
    indexHtml = await compilerCtx.fs.readFile(outputTarget.indexHtml);
  } catch (e) {}

  if (typeof indexHtml !== 'string') {
    // looks like we don't have an index html file, which is fine
    config.logger.debug(`prerenderApp, missing index.html for prerendering`);
    return [];
  }

  // get the prerender urls to queue up
  const prerenderQueue = getPrerenderQueue(config, outputTarget);

  if (!prerenderQueue.length) {
    const d = buildWarn(buildCtx.diagnostics);
    d.messageText = `No urls found in the prerender config`;
    return [];
  }

  return runPrerenderApp(config, compilerCtx, buildCtx, outputTarget, entryModules, prerenderQueue, indexHtml);
}


async function runPrerenderApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], prerenderQueue: d.PrerenderLocation[], indexHtml: string) {
  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`prerendering started`, !outputTarget.hydrateComponents);

  const hydrateResults: d.HydrateResults[] = [];

  try {
    await new Promise(resolve => {
      drainPrerenderQueue(config, compilerCtx, buildCtx, outputTarget, prerenderQueue, indexHtml, hydrateResults, resolve);
    });

    await generateHostConfig(config, compilerCtx, outputTarget, entryModules, hydrateResults);

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }

  if (hasError(buildCtx.diagnostics)) {
    timeSpan.finish(`prerendering failed`);

  } else {
    timeSpan.finish(`prerendered urls: ${hydrateResults.length}`);
  }

  if (compilerCtx.localPrerenderServer) {
    compilerCtx.localPrerenderServer.close();
    delete compilerCtx.localPrerenderServer;
  }

  return hydrateResults;
}


function drainPrerenderQueue(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, prerenderQueue: d.PrerenderLocation[], indexSrcHtml: string, hydrateResults: d.HydrateResults[], resolve: Function) {
  for (var i = 0; i < outputTarget.prerenderMaxConcurrent; i++) {
    const activelyProcessingCount = prerenderQueue.filter(p => p.status === 'processing').length;

    if (activelyProcessingCount >= outputTarget.prerenderMaxConcurrent) {
      // whooaa, slow down there buddy, let's not get carried away
      break;
    }

    runNextPrerenderUrl(config, compilerCtx, buildCtx, outputTarget, prerenderQueue, indexSrcHtml, hydrateResults, resolve);
  }

  const remaining = prerenderQueue.filter(p => {
    return p.status === 'processing' || p.status === 'pending';
  }).length;

  if (remaining === 0) {
    // we're not actively processing anything
    // and there aren't anymore urls in the queue to be prerendered
    // so looks like our job here is done, good work team
    resolve();
  }
}


async function runNextPrerenderUrl(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, prerenderQueue: d.PrerenderLocation[], indexSrcHtml: string, hydrateResults: d.HydrateResults[], resolve: Function) {
  const p = prerenderQueue.find(p => p.status === 'pending');
  if (!p) return;

  // we've got a url that's pending
  // well guess what, it's go time
  p.status = 'processing';

  try {
    // prender this path and wait on the results
    const results = await prerenderPath(config, compilerCtx, buildCtx, outputTarget, indexSrcHtml, p);
    // awesome!!

    // merge any diagnostics we just got from this
    config.logger.printDiagnostics(results.diagnostics);

    if (outputTarget.prerenderUrlCrawl) {
      crawlAnchorsForNextUrls(config, outputTarget, prerenderQueue, results.url, results.anchors);
    }

    hydrateResults.push(results);

    await writePrerenderDest(config, compilerCtx, outputTarget, results);

  } catch (e) {
    // darn, idk, bad news
    catchError(buildCtx.diagnostics, e);
  }

  // this job is not complete
  p.status = 'complete';

  // let's try to drain the queue again and let this
  // next call figure out if we're actually done or not
  drainPrerenderQueue(config, compilerCtx, buildCtx, outputTarget, prerenderQueue, indexSrcHtml, hydrateResults, resolve);
}


async function writePrerenderDest(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, results: d.HydrateResults) {
  // create the full path where this will be saved
  const filePath = getWritePathFromUrl(config, outputTarget, results.url);

  // add the prerender html content it to our collection of
  // files that need to be saved when we're all ready
  await compilerCtx.fs.writeFile(filePath, results.html);
}
