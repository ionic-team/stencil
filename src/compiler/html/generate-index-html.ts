import * as d from '../../declarations';
import { catchError, hasError } from '../util';
import { updateIndexHtmlServiceWorker } from '../service-worker/inject-sw-script';


export function generateIndexHtmls(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const indexHtmlOutputs = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.indexHtml);

  return Promise.all(indexHtmlOutputs.map(outputTarget => {
    return generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  }));
}


export async function generateIndexHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
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
    let indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);

    try {
      indexSrcHtml = await updateIndexHtmlServiceWorker(config, outputTarget, indexSrcHtml);

      // add the prerendered html to our list of files to write
      await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexSrcHtml);

      config.logger.debug(`optimizeHtml, write: ${outputTarget.indexHtml}`);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.srcIndexHtml}: ${e}`);
  }
}
