import * as d from '@declarations';
import { catchError } from '@utils';
import { updateIndexHtmlServiceWorker } from '../service-worker/inject-sw-script';


export async function generateIndexHtmls(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  if (!config.srcIndexHtml) {
    return;
  }

  const outputTargets = (config.outputTargets as d.OutputTargetWww[]).filter(o => {
    return o.indexHtml;
  });

  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate index.html started`, true);

  const promises = outputTargets.map(async outputTarget => {
    await generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  });

  await Promise.all(promises);

  timespan.finish(`generate index.html finished`);
}


async function generateIndexHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  if (buildCtx.shouldAbort) {
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

      await writeIndexHtmlOutput(compilerCtx, outputTarget, indexSrcHtml);

      buildCtx.debug(`generateIndexHtml, write: ${config.sys.path.relative(config.rootDir, outputTarget.indexHtml)}`);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    buildCtx.debug(`no index html: ${config.srcIndexHtml}`);
  }
}


async function writeIndexHtmlOutput(compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww, indexSrcHtml: string) {
  await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexSrcHtml);
}
