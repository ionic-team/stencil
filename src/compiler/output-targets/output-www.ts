import * as d from '@declarations';
import { catchError } from '@utils';
import { sys } from '@sys';
import { optimizeEsmLoaderImport } from '../html/optimize-esm-import';
import { updateIndexHtmlServiceWorker } from '../html/inject-sw-script';
import { serializeNodeToHtml } from '@mock-doc';
import { isOutputTargetWww } from './output-utils';
import { createDocument } from '../../mock-doc/document';
import { copyTasks } from '../copy/local-copy-tasks';

export async function outputWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetWww);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate index.html started`, true);

  await Promise.all(
    outputTargets.map(outputTarget => generateWww(config, compilerCtx, buildCtx, outputTarget))
  );

  timespan.finish(`generate index.html finished`);
}

async function generateWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  // Copy assets into www
  copyTasks(config, compilerCtx, buildCtx, outputTarget.copy, outputTarget.dir);

  // Process
  if (config.srcIndexHtml && outputTarget.indexHtml) {
    await generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  }
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
    const indexSrcHtml = await compilerCtx.fs.readFile(config.srcIndexHtml);
    const doc = createDocument(indexSrcHtml);
    try {
      await updateIndexHtmlServiceWorker(doc, config, buildCtx, outputTarget);
      await optimizeEsmLoaderImport(doc, config, compilerCtx, outputTarget);

      await compilerCtx.fs.writeFile(outputTarget.indexHtml, serializeNodeToHtml(doc));

      buildCtx.debug(`generateIndexHtml, write: ${sys.path.relative(config.rootDir, outputTarget.indexHtml)}`);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    buildCtx.debug(`no index html: ${config.srcIndexHtml}`);
  }
}
