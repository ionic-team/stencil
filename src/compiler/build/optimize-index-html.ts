import { BuildConfig, BuildContext, LoggerTimeSpan, OptimizeHtmlResults } from '../interfaces';
import { catchError, readFile, writeFile } from '../util';
import { createRenderer } from '../../server/index';


export function optimizeIndexHtml(config: BuildConfig, ctx: BuildContext) {
  const optimizeHtmlResults: OptimizeHtmlResults = {
    diagnostics: []
  };

  if (ctx.isRebuild && ctx.projectFileBuildCount === 0) {
    // no need to rebuild index.html if there were no project file changes
    return Promise.resolve(optimizeHtmlResults);
  }

  let timeSpan: LoggerTimeSpan;

  // get the source index html content
  return readFile(config.sys, config.indexHtmlSrc).then(indexSrcHtml => {
    timeSpan = config.logger.createTimeSpan(`optimize index html started`);

    // successfully got the source content
    optimizeHtmlResults.html = indexSrcHtml;

    // now let's optimize this thang (which is async)
    return optimizeHtml(config, ctx, optimizeHtmlResults).catch(err => {
      catchError(optimizeHtmlResults.diagnostics, err);
    });

  }).catch(() => {
    // it's ok if there's no index file
    config.logger.debug(`no index html to optimize: ${config.indexHtmlSrc}`);

  }).then(() => {
    timeSpan && timeSpan.finish(`optimize index html finished`);
    return optimizeHtmlResults;
  });
}


function optimizeHtml(config: BuildConfig, ctx: BuildContext, optimizeHtmlResults: OptimizeHtmlResults) {
  return Promise.resolve().then(() => {
    if (!config.prerenderIndex) {
      // don't bother with a renderer if we don't need one
      return Promise.resolve();
    }

    // create a server-side renderer
    const renderer = createRenderer(config, null, ctx);

    // create the hydrate options
    const hydrateOpts = Object.assign({}, config.prerenderIndex);

    // set the input html which we just read from the src index html file
    hydrateOpts.html = optimizeHtmlResults.html;

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    return renderer.hydrateToString(hydrateOpts).then(hydratedResults => {
      // hydrating to string is done!!
      // let's use this updated html for the index content now
      optimizeHtmlResults.html = hydratedResults.html;

      // merge in the diagnostics too
      optimizeHtmlResults.diagnostics = optimizeHtmlResults.diagnostics.concat(hydratedResults.diagnostics);

    }).catch(err => {
      // ahh man! what happened!
      catchError(optimizeHtmlResults.diagnostics, err);
    });

  }).then(() => {
    // write the index html to disk
    return writeIndexDest(config, ctx, optimizeHtmlResults);
  });
}


function writeIndexDest(config: BuildConfig, ctx: BuildContext, optimizeHtmlResults: OptimizeHtmlResults) {
  if (ctx.projectFiles.indexHtml === optimizeHtmlResults.html) {
    // only write to disk if the html content is different than last time
    return Promise.resolve(null);
  }

  // not using ctx.filesToWrite because it already happened
  ctx.projectFiles.indexHtml = optimizeHtmlResults.html;

  // keep track of how many times we built the index file
  // useful for debugging/testing
  ctx.indexBuildCount++;
  config.logger.debug(`optimizeHtml, write: ${config.indexHtmlBuild}`);

  return writeFile(config.sys, config.indexHtmlBuild, optimizeHtmlResults.html);
}
