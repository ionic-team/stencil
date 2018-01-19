import { Config, CompilerCtx, HydrateResults, Bundle, PrerenderConfig, PrerenderStatus, PrerenderLocation, BuildCtx } from '../../util/interfaces';
import { buildWarn, catchError, hasError, pathJoin } from '../util';
import { generateHostConfig } from './host-config';
import { prerenderPath } from './prerender-path';
import { crawlAnchorsForNextUrls, getPrerenderQueue } from './prerender-utils';


export async function prerenderApp(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[]) {
  if (!config.prerender) {
    // no need to rebuild index.html if there were no app file changes
    config.logger.debug(`prerenderApp, skipping because config.prerender is falsy`);
    return [];
  }

  if (!config.generateWWW) {
    // no need to rebuild index.html if there were no app file changes
    config.logger.debug(`prerenderApp, skipping because config.generateWWW is falsy`);
    return [];
  }

  // if there was src index.html file, then the process before this one
  // would have already loaded and updated the src index to its www path
  // get the www index html content for the template for all prerendered pages
  let indexHtml: string = null;
  try {
    indexHtml = await compilerCtx.fs.readFile(config.wwwIndexHtml);
  } catch (e) {}

  if (typeof indexHtml !== 'string') {
    // looks like we don't have an index html file, which is fine
    config.logger.debug(`prerenderApp, missing index.html for prerendering`);
    return [];
  }

  // get the prerender urls to queue up
  const prerenderQueue = getPrerenderQueue(config);

  if (!prerenderQueue.length) {
    const d = buildWarn(buildCtx.diagnostics);
    d.messageText = `No urls found in the prerender config`;
    return [];
  }

  return runPrerenderApp(config, compilerCtx, buildCtx, bundles, prerenderQueue, indexHtml);
}


async function runPrerenderApp(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[], prerenderQueue: PrerenderLocation[], indexHtml: string) {
  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`prerendering started`);

  const hydrateResults: HydrateResults[] = [];

  try {
    await new Promise(resolve => {
      drainPrerenderQueue(config, compilerCtx, buildCtx, prerenderQueue, indexHtml, hydrateResults, resolve);
    });

    await generateHostConfig(config, compilerCtx, bundles, hydrateResults);

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


function drainPrerenderQueue(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, prerenderQueue: PrerenderLocation[], indexSrcHtml: string, hydrateResults: HydrateResults[], resolve: Function) {
  for (var i = 0; i < (config.prerender as PrerenderConfig).maxConcurrent; i++) {
    var activelyProcessingCount = prerenderQueue.filter(p => p.status === PrerenderStatus.processing).length;

    if (activelyProcessingCount >= (config.prerender as PrerenderConfig).maxConcurrent) {
      // whooaa, slow down there buddy, let's not get carried away
      break;
    }

    runNextPrerenderUrl(config, compilerCtx, buildCtx, prerenderQueue, indexSrcHtml, hydrateResults, resolve);
  }

  const remaining = prerenderQueue.filter(p => {
    return p.status === PrerenderStatus.processing || p.status === PrerenderStatus.pending;
  }).length;

  if (remaining === 0) {
    // we're not actively processing anything
    // and there aren't anymore urls in the queue to be prerendered
    // so looks like our job here is done, good work team
    resolve();
  }
}


async function runNextPrerenderUrl(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, prerenderQueue: PrerenderLocation[], indexSrcHtml: string, hydrateResults: HydrateResults[], resolve: Function) {
  const p = prerenderQueue.find(p => p.status === PrerenderStatus.pending);
  if (!p) return;

  // we've got a url that's pending
  // well guess what, it's go time
  p.status = PrerenderStatus.processing;

  try {
    // prender this path and wait on the results
    const results = await prerenderPath(config, compilerCtx, buildCtx, indexSrcHtml, p);
    // awesome!!

    // merge any diagnostics we just got from this
    config.logger.printDiagnostics(results.diagnostics);

    if ((config.prerender as PrerenderConfig).crawl !== false) {
      crawlAnchorsForNextUrls(config, prerenderQueue, results);
    }

    hydrateResults.push(results);

    writePrerenderDest(config, compilerCtx, results);

  } catch (e) {
    // darn, idk, bad news
    catchError(buildCtx.diagnostics, e);
  }

  // this job is not complete
  p.status = PrerenderStatus.complete;

  // let's try to drain the queue again and let this
  // next call figure out if we're actually done or not
  drainPrerenderQueue(config, compilerCtx, buildCtx, prerenderQueue, indexSrcHtml, hydrateResults, resolve);
}


function writePrerenderDest(config: Config, ctx: CompilerCtx, results: HydrateResults) {
  const parsedUrl = config.sys.url.parse(results.url);

  // figure out the directory where this file will be saved
  const dir = config.sys.path.join(
    (config.prerender as PrerenderConfig).prerenderDir,
    parsedUrl.pathname
  );

  // create the full path where this will be saved (normalize for windowz)
  const filePath = pathJoin(config, dir, `index.html`);

  // add the prerender html content it to our collection of
  // files that need to be saved when we're all ready
  ctx.fs.writeFile(filePath, results.html);
}
