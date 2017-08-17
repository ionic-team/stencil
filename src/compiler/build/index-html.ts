import { BuildConfig, BuildContext, HydrateOptions } from '../../util/interfaces';
import { catchError, hasError, readFile } from '../util';
import { createRenderer } from '../../server/index';


export function buildIndexHtml(config: BuildConfig, ctx: BuildContext) {
  if (ctx.isRebuild && ctx.appFileBuildCount === 0 || hasError(ctx.diagnostics)) {
    // no need to rebuild index.html if there were no app file changes
    return Promise.resolve();
  }

  // get the source index html content
  return readFile(config.sys, config.indexHtmlSrc).then(indexSrcHtml => {

    if (!config.prerender) {
      // don't bother with a renderer if we don't need one
      // just copy over the src index.html file
      writeIndexDest(config, ctx, indexSrcHtml);
      return Promise.resolve();
    }

    // now let's optimize this thang (which is async)
    return prerenderHtml(config, ctx, indexSrcHtml).catch(err => {
      catchError(ctx.diagnostics, err);
    });

  }).catch(() => {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.indexHtmlSrc}`);
  });
}


function prerenderHtml(config: BuildConfig, ctx: BuildContext, indexSrcHtml: string) {
  const timeSpan = config.logger.createTimeSpan(`prerender index html started`);

  return Promise.resolve().then(() => {
    // create the renderer config
    const rendererConfig = Object.assign({}, config);

    // create the hydrate options from the prerender config
    const hydrateOpts: HydrateOptions = Object.assign({}, config.prerender);

    // set the input html which we just read from the src index html file
    hydrateOpts.html = indexSrcHtml;
    hydrateOpts.isPrerender = true;

    // create a deep copy of the registry so any changes inside the render
    // don't affect what we'll be saving
    const registry = JSON.parse(JSON.stringify(ctx.registry));

    // create a server-side renderer
    const renderer = createRenderer(rendererConfig, registry, ctx);

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

  }).then(() => {
    timeSpan.finish(`prerender index html finished`);
  });
}


function writeIndexDest(config: BuildConfig, ctx: BuildContext, indexHtml: string) {
  if (ctx.appFiles.indexHtml === indexHtml) {
    // only write to disk if the html content is different than last time
    return;
  }

  // add the prerendered html to our list of files to write
  // and cache the html to check against for next time
  ctx.filesToWrite[config.indexHtmlBuild] = ctx.appFiles.indexHtml = indexHtml;

  // keep track of how many times we built the index file
  // useful for debugging/testing
  ctx.indexBuildCount++;
  config.logger.debug(`optimizeHtml, write: ${config.indexHtmlBuild}`);
}
