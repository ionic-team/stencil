import { BuildConfig, BuildContext, LoggerTimeSpan } from '../../util/interfaces';
import { catchError, hasError, readFile } from '../util';
import { createRenderer } from '../../server/index';


export function prerenderIndexHtml(config: BuildConfig, ctx: BuildContext) {
  if (ctx.isRebuild && ctx.appFileBuildCount === 0 || hasError(ctx.diagnostics)) {
    // no need to rebuild index.html if there were no app file changes
    return Promise.resolve();
  }

  let timeSpan: LoggerTimeSpan;

  // get the source index html content
  return readFile(config.sys, config.indexHtmlSrc).then(indexSrcHtml => {
    timeSpan = config.logger.createTimeSpan(`prerender index html started`);

    // now let's optimize this thang (which is async)
    return prerenderHtml(config, ctx, indexSrcHtml).catch(err => {
      catchError(ctx.diagnostics, err);
    });

  }).catch(() => {
    // it's ok if there's no index file
    config.logger.debug(`no index html to prerender: ${config.indexHtmlSrc}`);

  }).then(() => {
    timeSpan && timeSpan.finish(`prerender index html finished`);
  });
}


function prerenderHtml(config: BuildConfig, ctx: BuildContext, indexSrcHtml: string) {
  return Promise.resolve().then(() => {
    if (!config.prerenderIndex) {
      // don't bother with a renderer if we don't need one
      return Promise.resolve();
    }

    // create the renderer config
    const rendererConfig = Object.assign({}, config);

    // create the hydrate options
    const hydrateOpts = Object.assign({}, rendererConfig.prerenderIndex);

    // create a server-side renderer
    const renderer = createRenderer(rendererConfig, ctx.registry, ctx);

    // set the input html which we just read from the src index html file
    hydrateOpts.html = indexSrcHtml;

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    return renderer.hydrateToString(hydrateOpts).then(hydratedResults => {
      // hydrating to string is done!!
      // let's use this updated html for the index content now
      // merge in the diagnostics too
      ctx.diagnostics = ctx.diagnostics.concat(hydratedResults.diagnostics);

      // update our index file with what that hydrated html!
      writeIndexDest(config, ctx, hydratedResults.html);

    }).catch(err => {
      // ahh man! what happened!
      catchError(ctx.diagnostics, err);
    });

  });
}


function writeIndexDest(config: BuildConfig, ctx: BuildContext, prerenderedHtml: string) {
  if (ctx.appFiles.indexHtml === prerenderedHtml) {
    // only write to disk if the html content is different than last time
    return;
  }

  // add the prerendered html to our list of files to write
  // and cache the html to check against for next time
  ctx.filesToWrite[config.indexHtmlBuild] = ctx.appFiles.indexHtml = prerenderedHtml;

  // keep track of how many times we built the index file
  // useful for debugging/testing
  ctx.indexBuildCount++;
  config.logger.debug(`optimizeHtml, write: ${config.indexHtmlBuild}`);
}
