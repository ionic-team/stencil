import * as d from '../../declarations';
import { catchError, normalizePath } from '@utils';
import { optimizeEsmLoaderImport } from '../html/optimize-esm-import';
import { updateIndexHtmlServiceWorker } from '../html/inject-sw-script';
import { serializeNodeToHtml } from '@mock-doc';
import { isOutputTargetWww } from './output-utils';
import { createDocument } from '../../mock-doc/document';
import { processCopyTasks } from '../copy/local-copy-tasks';
import { performCopyTasks } from '../copy/copy-tasks';
import { getComponentAssetsCopyTasks } from '../copy/assets-copy-tasks';

export async function outputWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetWww);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate www started`, true);

  await Promise.all(
    outputTargets.map(outputTarget => generateWww(config, compilerCtx, buildCtx, outputTarget))
  );

  timespan.finish(`generate www finished`);
}

async function generateWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww) {
  // Copy assets into www
  performCopyTasks(config, compilerCtx, buildCtx, [
    ...await processCopyTasks(config, outputTarget.dir, outputTarget.copy),
    ...getComponentAssetsCopyTasks(config, buildCtx, outputTarget.dir, true)
  ]);

  // Process
  if (config.srcIndexHtml && outputTarget.indexHtml) {
    await generateIndexHtml(config, compilerCtx, buildCtx, outputTarget);
  }
  await generateHostConfig(config, compilerCtx, outputTarget);
}

function generateHostConfig(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  const buildDir = normalizePath(config.sys.path.relative(outputTarget.dir, outputTarget.buildDir));
  const hostConfigPath = config.sys.path.join(outputTarget.dir, 'host.config.json');
  const hostConfigContent = JSON.stringify({
    'hosting': {
      'headers': [
        {
          'source': `/${buildDir}/p-*.js`,
          'headers': [ {
            'key': 'Cache-Control',
            'value': 'max-age=365000000, immutable'
          } ]
        }
      ]
    }
  }, null, '  ');

  return compilerCtx.fs.writeFile(hostConfigPath, hostConfigContent);
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

      buildCtx.debug(`generateIndexHtml, write: ${config.sys.path.relative(config.rootDir, outputTarget.indexHtml)}`);

    } catch (e) {
      catchError(buildCtx.diagnostics, e);
    }

  } catch (e) {
    // it's ok if there's no index file
    buildCtx.debug(`no index html: ${config.srcIndexHtml}`);
  }
}
