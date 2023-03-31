import { isOutputTargetHydrate } from '@utils';

import type * as d from '../../../declarations';
import { getBuildFeatures, updateBuildConditionals } from '../../app-core/app-data';

export const getLazyBuildConditionals = (
  config: d.ValidatedConfig,
  cmps: d.ComponentCompilerMeta[]
): d.BuildConditionals => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.lazyLoad = true;
  build.hydrateServerSide = false;
  // TODO(STENCIL-659): Remove code implementing the CSS variable shim
  build.cssVarShim = config.extras.__deprecated__cssVarsShim;
  build.transformTagName = config.extras.tagNameTransform;
  build.asyncQueue = config.taskQueue === 'congestionAsync';
  build.taskQueue = config.taskQueue !== 'immediate';
  build.initializeNextTick = config.extras.initializeNextTick;

  const hasHydrateOutputTargets = config.outputTargets.some(isOutputTargetHydrate);
  build.hydrateClientSide = hasHydrateOutputTargets;

  updateBuildConditionals(config, build);

  return build;
};
