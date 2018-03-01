import { BuildCtx, CompilerCtx, Config, ServiceWorkerConfig } from '../../declarations';
import { catchError, hasError } from '../util';
import { injectRegisterServiceWorker, injectUnregisterServiceWorker } from '../service-worker/inject-sw-script';


export async function generateIndexHtml(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {

  if (canSkipGenerateIndexHtml(config, compilerCtx, buildCtx)) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {
    const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);

    try {
      await setIndexHtmlContent(config, compilerCtx, indexSrcHtml);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.srcIndexHtml}: ${e}`);
  }
}


function canSkipGenerateIndexHtml(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  if ((compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0) || hasError(buildCtx.diagnostics) || !config.generateWWW) {
    // no need to rebuild index.html if there were no app file changes
    return true;
  }
  return false;
}


async function setIndexHtmlContent(config: Config, compilerCtx: CompilerCtx, indexHtml: string) {
  const swConfig = config.serviceWorker as ServiceWorkerConfig;

  if (!swConfig && config.devMode) {
    // if we're not generating a sw, and this is a dev build
    // then let's inject a script that always unregisters any service workers
    indexHtml = injectUnregisterServiceWorker(indexHtml);

  } else if (swConfig) {
    // we have a valid sw config, so we'll need to inject the register sw script
    indexHtml = await injectRegisterServiceWorker(config, swConfig, indexHtml);
  }

  // add the prerendered html to our list of files to write
  await compilerCtx.fs.writeFile(config.wwwIndexHtml, indexHtml);

  config.logger.debug(`optimizeHtml, write: ${config.wwwIndexHtml}`);
}
