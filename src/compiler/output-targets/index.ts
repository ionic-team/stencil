import type { RollupCache } from 'rollup';

import type * as d from '../../declarations';
import { outputCopy } from './copy/output-copy';
import { outputCollection } from './dist-collection';
import { outputCustomElements } from './dist-custom-elements';
import { outputHydrateScript } from './dist-hydrate-script';
import { outputLazy } from './dist-lazy/lazy-output';
import { outputDocs } from './output-docs';
import { outputLazyLoader } from './output-lazy-loader';
import { outputTypes } from './output-types';
import { outputWww } from './output-www';

export const generateOutputTargets = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
) => {
  const timeSpan = buildCtx.createTimeSpan('generate outputs started', true);

  const changedModuleFiles = Array.from(compilerCtx.changedModules)
    .map((filename) => compilerCtx.moduleMap.get(filename))
    .filter((mod) => mod && !mod.isCollectionDependency);

  compilerCtx.changedModules.clear();

  invalidateRollupCaches(compilerCtx);

  await Promise.all([
    outputCopy(config, compilerCtx, buildCtx),
    outputCollection(config, compilerCtx, buildCtx, changedModuleFiles),
    outputCustomElements(config, compilerCtx, buildCtx),
    outputHydrateScript(config, compilerCtx, buildCtx),
    outputLazyLoader(config, compilerCtx),
    outputLazy(config, compilerCtx, buildCtx),
    outputWww(config, compilerCtx, buildCtx),
  ]);

  // must run after all the other outputs
  // since it validates files were created
  await outputDocs(config, compilerCtx, buildCtx);
  await outputTypes(config, compilerCtx, buildCtx);

  timeSpan.finish('generate outputs finished');
};

const invalidateRollupCaches = (compilerCtx: d.CompilerCtx) => {
  const invalidatedIds = compilerCtx.changedFiles;
  compilerCtx.rollupCache.forEach((cache: RollupCache) => {
    cache.modules.forEach((mod) => {
      if (mod.transformDependencies.some((id) => invalidatedIds.has(id))) {
        mod.originalCode = null;
      }
    });
  });
};
