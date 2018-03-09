import { BuildCtx, CompilerCtx, Config, OutputTarget } from '../../declarations';
import { catchError, hasError } from '../util';
import { injectRegisterServiceWorker, injectUnregisterServiceWorker } from '../service-worker/inject-sw-script';


export function generateIndexHtmls(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  return Promise.all(config.outputTargets.map(outputTarget => {
    return generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  }));
}


export async function generateIndexHtml(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget) {
  if (hasError(buildCtx.diagnostics)) {
    return;
  }

  if (!outputTarget.indexHtml || !config.srcIndexHtml) {
    return;
  }

  if (compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {
    const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);

    try {
      await setIndexHtmlContent(config, compilerCtx, outputTarget, indexSrcHtml);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.srcIndexHtml}: ${e}`);
  }
}


async function setIndexHtmlContent(config: Config, compilerCtx: CompilerCtx, outputTarget: OutputTarget, indexHtml: string) {
  if (!outputTarget.serviceWorker && config.devMode) {
    // if we're not generating a sw, and this is a dev build
    // then let's inject a script that always unregisters any service workers
    indexHtml = injectUnregisterServiceWorker(indexHtml);

  } else if (outputTarget.serviceWorker) {
    // we have a valid sw config, so we'll need to inject the register sw script
    indexHtml = await injectRegisterServiceWorker(config, outputTarget, indexHtml);
  }

  // add the prerendered html to our list of files to write
  await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexHtml);

  config.logger.debug(`optimizeHtml, write: ${outputTarget.indexHtml}`);
}
