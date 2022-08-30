import type * as d from '../../../declarations';
import { getBuildFeatures, updateBuildConditionals } from '../../app-core/app-data';
import { isOutputTargetHydrate } from '../output-utils';

export const getLazyBuildConditionals = (
  config: d.ValidatedConfig,
  cmps: d.ComponentCompilerMeta[]
): d.BuildConditionals => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateServerSide = false;
  build.cssVarShim = config.extras.cssVarsShim;
  build.transformTagName = config.extras.tagNameTransform;
  build.asyncQueue = config.taskQueue === 'congestionAsync';
  build.taskQueue = config.taskQueue !== 'immediate';
  build.initializeNextTick = config.extras.initializeNextTick;

  const hasHydrateOutputTargets = config.outputTargets.some(isOutputTargetHydrate);
  build.hydrateClientSide = hasHydrateOutputTargets;

  updateBuildConditionals(config, build);

  return build;
};
