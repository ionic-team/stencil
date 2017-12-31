import { BuildConfig, BuildContext, HydrateResults, Bundle, PrerenderConfig, PrerenderStatus, PrerenderLocation, PrerenderResult } from '../../util/interfaces';
import { buildError, catchError, hasError, normalizePath, readFile } from '../util';
import { generateHostConfig } from './host-config';
import { prerenderUrl } from './prerender-url';


export async function prerenderApp(config: BuildConfig, ctx: BuildContext, bundles: Bundle[]) {
  const prerenderResults: PrerenderResult[] = [];

  if (hasError(ctx.diagnostics)) {
    // no need to rebuild index.html if there were no app file changes
    config.logger.debug(`prerenderApp, skipping because build has errors`);
    return prerenderResults;
  }

  if (!config.prerender) {
    // no need to rebuild index.html if there were no app file changes
    config.logger.debug(`prerenderApp, skipping because config.prerender is falsy`);
    return prerenderResults;
  }

  if (!config.generateWWW) {
    // no need to rebuild index.html if there were no app file changes
    config.logger.debug(`prerenderApp, skipping because config.generateWWW is falsy`);
    return prerenderResults;
  }

  // if there was src index.html file, then the process before this one
  // would have already loaded and updated the src index to its www path
  // get the www index html content for the template for all prerendered pages
  let indexHtml: string = null;
  try {
    indexHtml = await readFile(config.sys, config.wwwIndexHtml);
  } catch (e) {}

  if (typeof indexHtml !== 'string') {
    // looks like we don't have an index html file, which is fine
    config.logger.debug(`prerenderApp, missing index.html for prerendering`);
    return prerenderResults;
  }

  // get the prerender urls to queue up
  const prerenderQueue = getPrerenderQueue(config);

  if (!prerenderQueue.length) {
    const d = buildError(ctx.diagnostics);
    d.messageText = `No urls found in the prerender config`;
    return prerenderResults;
  }

  // keep track of how long the entire build process takes
  const timeSpan = config.logger.createTimeSpan(`prerendering started`);

  try {
    await new Promise(resolve => {
      drainPrerenderQueue(config, ctx, prerenderQueue, indexHtml, prerenderResults, resolve);
    });

    await generateHostConfig(config, ctx, bundles, prerenderResults);

  } catch (e) {
    catchError(ctx.diagnostics, e);
  }

  if (hasError(ctx.diagnostics)) {
    timeSpan.finish(`prerendering failed`);
  } else {
    timeSpan.finish(`prerendered urls: ${prerenderResults.length}`);
  }

  if (ctx.localPrerenderServer) {
    ctx.localPrerenderServer.close();
    delete ctx.localPrerenderServer;
  }

  return prerenderResults;
}


function drainPrerenderQueue(config: BuildConfig, ctx: BuildContext, prerenderQueue: PrerenderLocation[], indexSrcHtml: string, prerenderResults: PrerenderResult[], resolve: Function) {
  for (var i = 0; i < (config.prerender as PrerenderConfig).maxConcurrent; i++) {
    var activelyProcessingCount = prerenderQueue.filter(p => p.status === PrerenderStatus.processing).length;

    if (activelyProcessingCount >= (config.prerender as PrerenderConfig).maxConcurrent) {
      // whooaa, slow down there buddy, let's not get carried away
      break;
    }

    runNextPrerenderUrl(config, ctx, prerenderQueue, indexSrcHtml, prerenderResults, resolve);
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


function runNextPrerenderUrl(config: BuildConfig, ctx: BuildContext, prerenderQueue: PrerenderLocation[], indexSrcHtml: string, prerenderResults: PrerenderResult[], resolve: Function) {
  const p = prerenderQueue.find(p => p.status === PrerenderStatus.pending);
  if (!p) return;

  // we've got a url that's pending
  // well guess what, it's go time
  p.status = PrerenderStatus.processing;

  prerenderUrl(config, ctx, indexSrcHtml, p).then(results => {
    // awesome!!

    // merge any diagnostics we just got from this
    ctx.diagnostics = ctx.diagnostics.concat(results.diagnostics);

    if ((config.prerender as PrerenderConfig).crawl !== false) {
      crawlAnchorsForNextUrls(config, prerenderQueue, results);
    }

    const url = config.sys.url.parse(results.url);
    prerenderResults.push({
      url: results.url,
      hostname: url.hostname,
      path: url.path,
      components: results.components,
      styleUrls: results.styleUrls,
      scriptUrls: results.scriptUrls,
      imgUrls: results.imgUrls
    });

    writePrerenderDest(config, ctx, results);

  }).catch(err => {
    // darn, idk, bad news
    catchError(ctx.diagnostics, err);

  }).then(() => {
    p.status = PrerenderStatus.complete;

    // let's try to drain the queue again and let this
    // next call figure out if we're actually done or not
    drainPrerenderQueue(config, ctx, prerenderQueue, indexSrcHtml, prerenderResults, resolve);
  });
}


function writePrerenderDest(config: BuildConfig, ctx: BuildContext, results: HydrateResults) {
  const parsedUrl = config.sys.url.parse(results.url);

  // figure out the directory where this file will be saved
  const dir = config.sys.path.join(
    (config.prerender as PrerenderConfig).prerenderDir,
    parsedUrl.pathname
  );

  // create the full path where this will be saved (normalize for windowz)
  const filePath = normalizePath(config.sys.path.join(dir, `index.html`));

  // add the prerender html content it to our collection of
  // files that need to be saved when we're all ready
  ctx.filesToWrite[filePath] = results.html;
}


function crawlAnchorsForNextUrls(config: BuildConfig, prerenderQueue: PrerenderLocation[], results: HydrateResults) {
  results.anchors && results.anchors.forEach(anchor => {
    addUrlToProcess(config, results.url, prerenderQueue, anchor.href);
  });
}


export function normalizePrerenderUrl(config: BuildConfig, windowLocationHref: string, urlStr: string) {
  let p: PrerenderLocation = null;

  try {
    if (typeof urlStr !== 'string') return null;

    let parsedUrl = config.sys.url.parse(urlStr);

    // don't bother for basically empty <a> tags
    // or urls that are not on the same domain
    if (!parsedUrl.pathname || parsedUrl.protocol || parsedUrl.auth || parsedUrl.hostname || parsedUrl.port) return null;

    // clear out any querystrings and hashes
    parsedUrl.search = null;
    parsedUrl.hash = null;

    // convert it back to a nice in pretty url
    p = {
      url: config.sys.url.format(parsedUrl)
    };

    // resolve it against the base window location url
    p.url = config.sys.url.resolve(windowLocationHref, p.url);

    parsedUrl = config.sys.url.parse(p.url);

    p.pathname = parsedUrl.pathname;

  } catch (e) {
    config.logger.error(`normalizePrerenderUrl: ${e}`);
    return null;
  }

  return p;
}


function addUrlToProcess(config: BuildConfig, windowLocationHref: string, prerenderQueue: PrerenderLocation[], urlStr: string) {
  const pUrl = normalizePrerenderUrl(config, windowLocationHref, urlStr);

  if (!pUrl || prerenderQueue.some(p => p.url === pUrl.url)) {
    return;
  }

  pUrl.status = PrerenderStatus.pending;

  prerenderQueue.push(pUrl);
}


function getPrerenderQueue(config: BuildConfig) {
  const prerenderHost = `http://${(config.prerender as PrerenderConfig).host}`;

  const prerenderQueue: PrerenderLocation[] = [];
  const prerenderConfig = config.prerender as PrerenderConfig;

  if (Array.isArray(prerenderConfig.include)) {
    prerenderConfig.include.forEach(prerenderUrl => {
      addUrlToProcess(config, prerenderHost, prerenderQueue, prerenderUrl.url);
    });
  }

  return prerenderQueue;
}
