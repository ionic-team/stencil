import * as d from '../../declarations';
import { catchError } from '../util';
import { updateIndexHtmlServiceWorker } from '../service-worker/inject-sw-script';


export async function generateIndexHtmls(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (buildCtx.shouldAbort()) {
    return;
  }

  const indexHtmlOutputs = (config.outputTargets as d.OutputTargetWww[]).filter(o => o.indexHtml);

  await Promise.all(indexHtmlOutputs.map(async outputTarget => {
    await generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  }));
}


export async function generateIndexHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (!outputTarget.indexHtml || !config.srcIndexHtml) {
    return;
  }

  if (buildCtx.shouldAbort()) {
    return;
  }

  if (compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0 && !buildCtx.hasIndexHtmlChanges) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {
    let indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);

    try {
      indexSrcHtml = await updateIndexHtmlServiceWorker(config, buildCtx, outputTarget, indexSrcHtml);

      // add the prerendered html to our list of files to write
      await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexSrcHtml);

      config.logger.debug(`optimizeHtml, write: ${outputTarget.indexHtml}`);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    config.logger.debug(`no index html: ${config.srcIndexHtml}`);
  }
}
