import { BuildConfig, BuildContext, PrerenderLocation } from '../../util/interfaces';
import { catchError, hasError, readFile } from '../util';
import { prerenderUrl } from './prerender-url';


export function prerenderIndexHtml(config: BuildConfig, ctx: BuildContext) {
  if (ctx.isRebuild && ctx.appFileBuildCount === 0 || hasError(ctx.diagnostics)) {
    // no need to rebuild index.html if there were no app file changes
    return Promise.resolve();
  }

  // get the source index html content
  return readFile(config.sys, config.srcIndexHtml).then(indexSrcHtml => {

    if (!config.prerender) {
      // don't bother with a renderer if we don't need one
      // just copy over the src index.html file
      writeIndexDest(config, ctx, indexSrcHtml);
      return Promise.resolve();
    }

    const prerenderLocation: PrerenderLocation = {
      url: '/',
      pathname: '/'
    };

    // now let's optimize this thang (which is async)
    return prerenderUrl(config, ctx, indexSrcHtml, prerenderLocation).then(results => {
      // update our index file with that hydrated html!
      writeIndexDest(config, ctx, results.html);

      // merge in the diagnostics too
      ctx.diagnostics = ctx.diagnostics.concat(results.diagnostics);

    }).catch(err => {
      catchError(ctx.diagnostics, err);
    });

  }).catch(() => {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.srcIndexHtml}`);
  });
}


function writeIndexDest(config: BuildConfig, ctx: BuildContext, indexHtml: string) {
  if (ctx.appFiles.indexHtml === indexHtml) {
    // only write to disk if the html content is different than last time
    return;
  }

  // add the prerendered html to our list of files to write
  // and cache the html to check against for next time
  ctx.filesToWrite[config.wwwIndexHtml] = ctx.appFiles.indexHtml = indexHtml;

  // keep track of how many times we built the index file
  // useful for debugging/testing
  ctx.indexBuildCount++;
  config.logger.debug(`optimizeHtml, write: ${config.wwwIndexHtml}`);
}
