import { BuildConfig, BuildContext, ServiceWorkerConfig } from '../../util/interfaces';
import { hasError, readFile } from '../util';
import { injectRegisterServiceWorker, injectUnregisterServiceWorker } from '../service-worker/inject-sw-script';


export function generateIndexHtml(config: BuildConfig, ctx: BuildContext) {
  if ((ctx.isRebuild && ctx.appFileBuildCount === 0) || hasError(ctx.diagnostics) || !config.generateWWW) {
    // no need to rebuild index.html if there were no app file changes
    return Promise.resolve();
  }

  // get the source index html content
  return readFile(config.sys, config.srcIndexHtml).then(indexSrcHtml => {
    // set the index content to be written
    return setIndexHtmlContent(config, ctx, indexSrcHtml);

  }).catch(() => {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.srcIndexHtml}`);
  });
}


function setIndexHtmlContent(config: BuildConfig, ctx: BuildContext, indexHtml: string) {
  const swConfig = config.serviceWorker as ServiceWorkerConfig;

  if (!swConfig && config.devMode) {
    // if we're not generating a sw, and this is a dev build
    // then let's inject a script that always unregisters any service workers
    indexHtml = injectUnregisterServiceWorker(indexHtml);

  } else if (swConfig) {
    // we have a valid sw config, so we'll need to inject the register sw script
    indexHtml = injectRegisterServiceWorker(config, swConfig, indexHtml);
  }

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
