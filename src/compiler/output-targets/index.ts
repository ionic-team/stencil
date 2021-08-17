import type * as d from '../../declarations';
import { outputAngular } from './output-angular';
import { outputCopy } from './copy/output-copy';
import { outputCustomElements } from './dist-custom-elements';
import { outputCustomElementsBundle } from './dist-custom-elements-bundle';
import { outputDocs } from './output-docs';
import { outputHydrateScript } from './dist-hydrate-script';
import { outputLazy } from './dist-lazy/lazy-output';
import { outputLazyLoader } from './output-lazy-loader';
import { outputWww } from './output-www';
import { outputCollection } from './dist-collection';
import { outputTypes } from './output-types';
import type { RollupCache } from 'rollup';
import { getStencilCompilerContext } from '@utils';

export const generateOutputTargets = async (config: d.Config, buildCtx: d.BuildCtx) => {
  const timeSpan = buildCtx.createTimeSpan('generate outputs started', true);

  const changedModuleFiles = Array.from(getStencilCompilerContext().changedModules)
    .map((filename) => getStencilCompilerContext().moduleMap.get(filename))
    .filter((mod) => mod && !mod.isCollectionDependency);

  getStencilCompilerContext().changedModules.clear();

  invalidateRollupCaches();

  await Promise.all([
    outputAngular(config, buildCtx),
    outputCopy(config, buildCtx),
    outputCollection(config, buildCtx, changedModuleFiles),
    outputCustomElements(config, buildCtx),
    outputCustomElementsBundle(config, buildCtx),
    outputHydrateScript(config, buildCtx),
    outputLazyLoader(config),
    outputLazy(config, buildCtx),
    outputWww(config, buildCtx),
  ]);

  // must run after all the other outputs
  // since it validates files were created
  await outputDocs(config, buildCtx);
  await outputTypes(config, buildCtx);

  timeSpan.finish('generate outputs finished');
};

const invalidateRollupCaches = () => {
  const invalidatedIds = getStencilCompilerContext().changedFiles;
  getStencilCompilerContext().rollupCache.forEach((cache: RollupCache) => {
    cache.modules.forEach((mod) => {
      if (mod.transformDependencies.some((id) => invalidatedIds.has(id))) {
        mod.originalCode = null;
      }
    });
  });
};
