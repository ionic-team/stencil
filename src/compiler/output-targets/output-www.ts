import { isOutputTargetWww } from './output-utils';
import { processCopyTasks } from '../copy/local-copy-tasks';
import { inlineEsmImport } from '../html/inline-esm-import';
import { optimizeCriticalPath } from '../html/inject-module-preloads';
import { updateIndexHtmlServiceWorker } from '../html/inject-sw-script';
import { cloneDocument, serializeNodeToHtml } from '@mock-doc';
import * as d from '../../declarations';
import { catchError, flatOne, normalizePath, unique } from '@utils';
import { performCopyTasks } from '../copy/copy-tasks';
import { generateServiceWorkers } from '../service-worker/generate-sw';
import { generateEs5DisabledMessage } from '../app-core/app-es5-disabled';
import { getUsedComponents } from '../html/used-components';

export async function outputWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleModules: d.BundleModule[]) {
  const outputTargets = config.outputTargets.filter(isOutputTargetWww);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate www started`, true);
  const criticalBundles = getCriticalPath(buildCtx, bundleModules);

  await Promise.all(
    outputTargets.map(outputTarget => generateWww(config, compilerCtx, buildCtx, criticalBundles, outputTarget))
  );
  await generateServiceWorkers(config, compilerCtx, buildCtx);

  timespan.finish(`generate www finished`);
}

function getCriticalPath(buildCtx: d.BuildCtx, bundleModules: d.BundleModule[]) {
  if (!buildCtx.indexDoc || !bundleModules) {
    return [];
  }
  return unique(
    flatOne(
      getUsedComponents(buildCtx.indexDoc, buildCtx.components)
        .map(tagName => getModulesForTagName(tagName, bundleModules))
    )
  ).sort();
}

function getModulesForTagName(tagName: string, bundleModules: d.BundleModule[], _defaultMode?: string) {
  const bundle = bundleModules.find(bundle => bundle.cmps.some(c => c.tagName === tagName));
  const entry = bundle.outputs.length === 1
    ? [bundle.outputs[0].fileName]
    : [];
  return [
    ...entry,
    ...bundle.rollupResult.imports
  ];
}

async function generateWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, criticalPath: string[], outputTarget: d.OutputTargetWww) {
  // Copy assets into www
  performCopyTasks(config, compilerCtx, buildCtx,
    await processCopyTasks(config, outputTarget.dir, outputTarget.copy),
  );
  if (!config.buildEs5) {
    await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
  }

  // Process
  if (buildCtx.indexDoc && outputTarget.indexHtml) {
    await generateIndexHtml(config, compilerCtx, buildCtx, criticalPath, outputTarget);
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

async function generateIndexHtml(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, criticalPath: string[], outputTarget: d.OutputTargetWww) {
  if (buildCtx.shouldAbort) {
    return;
  }

  if (compilerCtx.hasSuccessfulBuild && buildCtx.appFileBuildCount === 0 && !buildCtx.hasIndexHtmlChanges) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {

    try {
      const doc = cloneDocument(buildCtx.indexDoc);

      await updateIndexHtmlServiceWorker(doc, config, buildCtx, outputTarget);
      await inlineEsmImport(doc, config, compilerCtx, outputTarget);
      optimizeCriticalPath(doc, config, criticalPath, outputTarget);

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
