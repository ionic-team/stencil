import type * as d from '../../declarations';
import { addScriptDataAttribute } from '../html/add-script-attr';
import { catchError, flatOne, unique } from '@utils';
import { cloneDocument, serializeNodeToHtml } from '@stencil/core/mock-doc';
import { generateEs5DisabledMessage } from '../app-core/app-es5-disabled';
import { generateHashedCopy } from '../output-targets/copy/hashed-copy';
import { getAbsoluteBuildDir } from '../html/html-utils';
import { getScopeId } from '../style/scope-css';
import { getUsedComponents } from '../html/used-components';
import { INDEX_ORG } from '../service-worker/generate-sw';
import { inlineStyleSheets } from '../html/inline-style-sheets';
import { isOutputTargetWww } from './output-utils';
import { join, relative } from 'path';
import { optimizeCriticalPath } from '../html/inject-module-preloads';
import { optimizeEsmImport } from '../html/inline-esm-import';
import { updateGlobalStylesLink } from '../html/update-global-styles-link';
import { updateIndexHtmlServiceWorker } from '../html/inject-sw-script';

export const outputWww = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  const outputTargets = config.outputTargets.filter(isOutputTargetWww);
  if (outputTargets.length === 0) {
    return;
  }

  const timespan = buildCtx.createTimeSpan(`generate www started`, true);
  const criticalBundles = getCriticalPath(buildCtx);

  await Promise.all(
    outputTargets.map((outputTarget) => generateWww(config, compilerCtx, buildCtx, criticalBundles, outputTarget))
  );

  timespan.finish(`generate www finished`);
};

const getCriticalPath = (buildCtx: d.BuildCtx) => {
  const componentGraph = buildCtx.componentGraph;
  if (!buildCtx.indexDoc || !componentGraph) {
    return [];
  }
  return unique(
    flatOne(
      getUsedComponents(buildCtx.indexDoc, buildCtx.components)
        .map((tagName) => getScopeId(tagName))
        .map((scopeId) => buildCtx.componentGraph.get(scopeId) || [])
    )
  ).sort();
};

const generateWww = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  criticalPath: string[],
  outputTarget: d.OutputTargetWww
) => {
  if (!config.buildEs5) {
    await generateEs5DisabledMessage(config, compilerCtx, outputTarget);
  }

  // Copy global styles into the build directory
  // Process
  if (buildCtx.indexDoc && outputTarget.indexHtml) {
    await generateIndexHtml(config, compilerCtx, buildCtx, criticalPath, outputTarget);
  }
  await generateHostConfig(compilerCtx, outputTarget);
};

const generateHostConfig = (compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetWww) => {
  const buildDir = getAbsoluteBuildDir(outputTarget);
  const hostConfigPath = join(outputTarget.appDir, 'host.config.json');
  const hostConfigContent = JSON.stringify(
    {
      hosting: {
        headers: [
          {
            source: join(buildDir, '/p-*'),
            headers: [
              {
                key: 'Cache-Control',
                value: 'max-age=31556952, s-maxage=31556952, immutable',
              },
            ],
          },
        ],
      },
    },
    null,
    '  '
  );

  return compilerCtx.fs.writeFile(hostConfigPath, hostConfigContent, { outputTargetType: outputTarget.type });
};

const generateIndexHtml = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  criticalPath: string[],
  outputTarget: d.OutputTargetWww
) => {
  if (compilerCtx.hasSuccessfulBuild && !buildCtx.hasHtmlChanges) {
    // no need to rebuild index.html if there were no app file changes
    return;
  }

  // get the source index html content
  try {
    const doc = cloneDocument(buildCtx.indexDoc);
    addScriptDataAttribute(config, doc, outputTarget);

    // validateHtml(config, buildCtx, doc);
    await updateIndexHtmlServiceWorker(config, buildCtx, doc, outputTarget);
    if (!config.watch && !config.devMode) {
      const globalStylesFilename = await generateHashedCopy(
        config,
        compilerCtx,
        join(outputTarget.buildDir, `${config.fsNamespace}.css`)
      );
      const scriptFound = await optimizeEsmImport(config, compilerCtx, doc, outputTarget);
      await inlineStyleSheets(compilerCtx, doc, MAX_CSS_INLINE_SIZE, outputTarget);
      updateGlobalStylesLink(config, doc, globalStylesFilename, outputTarget);
      if (scriptFound) {
        optimizeCriticalPath(doc, criticalPath, outputTarget);
      }
    }

    const indexContent = serializeNodeToHtml(doc);
    await compilerCtx.fs.writeFile(outputTarget.indexHtml, indexContent, { outputTargetType: outputTarget.type });

    if (outputTarget.serviceWorker && config.flags.prerender) {
      await compilerCtx.fs.writeFile(join(outputTarget.appDir, INDEX_ORG), indexContent, {
        outputTargetType: outputTarget.type,
      });
    }

    buildCtx.debug(`generateIndexHtml, write: ${relative(config.rootDir, outputTarget.indexHtml)}`);
  } catch (e) {
    catchError(buildCtx.diagnostics, e);
  }
};

const MAX_CSS_INLINE_SIZE = 3 * 1024;
