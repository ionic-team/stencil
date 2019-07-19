import * as d from '../../declarations';
import { catchError, flatOne, unique } from '@utils';
import { generateEs5DisabledMessage } from '../app-core/app-es5-disabled';
import { getUsedComponents } from '../html/used-components';
import { optimizeEsmImport } from '../html/inline-esm-import';
import { isOutputTargetWww } from './output-utils';
import { optimizeCriticalPath } from '../html/inject-module-preloads';
import { generateHashedCopy } from '../copy/hashed-copy';
import { updateIndexHtmlServiceWorker } from '../html/inject-sw-script';
import { updateGlobalStylesLink } from '../html/update-global-styles-link';
import { getScopeId } from '../style/scope-css';
import { inlineStyleSheets } from '../html/inline-style-sheets';
import { INDEX_ORG } from '../service-worker/generate-sw';
import { getAbsoluteBuildDir } from '../html/utils';


export async function outputWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetWww);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate www started`, true);
  const criticalBundles = getCriticalPath(buildCtx);

  await Promise.all(
    outputTargets.map(outputTarget => generateWww(config, compilerCtx, buildCtx, criticalBundles, outputTarget))
  );

  timespan.finish(`generate www finished`);
}

function getCriticalPath(buildCtx: d.BuildCtx) {
  const componentGraph = buildCtx.componentGraph;
  if (!buildCtx.indexDoc || !componentGraph) {
    return [];
  }
  return unique(
    flatOne(
      getUsedComponents(buildCtx.indexDoc, buildCtx.components)
        .map(tagName => getScopeId(tagName))
        .map(scopeId => buildCtx.componentGraph.get(scopeId) || [])
    )
  ).sort();
}

async function generateWww(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, criticalPath: string[], outputTarget: d.OutputTargetWww) {
  if (!config.buildEs5) {
    await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
  }

  // Copy global styles into the build directory
  // Process
  if (buildCtx.indexDoc && outputTarget.indexHtml) {
    await generateIndexHtml(config, compilerCtx, buildCtx, criticalPath, outputTarget);
  }
  await generateHostConfig(config, compilerCtx, outputTarget);
}

function generateHostConfig(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) {
  const buildDir = getAbsoluteBuildDir(config, outputTarget);
  const hostConfigPath = config.sys.path.join(outputTarget.appDir, 'host.config.json');
  const hostConfigContent = JSON.stringify({
    'hosting': {
      'headers': [
        {
          'source': config.sys.path.join(buildDir, '/p-*'),
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
  if (compilerCtx.hasSuccessfulBuild && !buildCtx.hasHtmlChanges) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {
    const doc = config.sys.cloneDocument(buildCtx.indexDoc);

    // validateHtml(config, buildCtx, doc);
    await updateIndexHtmlServiceWorker(config, buildCtx, doc, outputTarget);
    if (!config.watch && !config.devMode) {
      const globalStylesFilename = await generateHashedCopy(config, compilerCtx, config.sys.path.join(outputTarget.buildDir, `${config.fsNamespace}.css`));
      const scriptFound = await optimizeEsmImport(config, compilerCtx, doc, outputTarget);
      await inlineStyleSheets(config, compilerCtx, doc, MAX_CSS_INLINE_SIZE, outputTarget);
      updateGlobalStylesLink(config, doc, globalStylesFilename, outputTarget);
      if (scriptFound) {
        optimizeCriticalPath(config, doc, criticalPath, outputTarget);
      }
    }

    if (config.sys.serializeNodeToHtml != null) {
      const indexContent = config.sys.serializeNodeToHtml(doc);
      await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexContent);
      if (outputTarget.serviceWorker && config.flags.prerender) {
        await compilerCtx.fs.writeFile(config.sys.path.join(outputTarget.appDir, INDEX_ORG), indexContent);
      }

      buildCtx.debug(`generateIndexHtml, write: ${config.sys.path.relative(config.rootDir, outputTarget.indexHtml)}`);
    }

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
}

const MAX_CSS_INLINE_SIZE = 3 * 1024;
