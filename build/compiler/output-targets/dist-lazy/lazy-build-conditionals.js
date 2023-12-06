import { isOutputTargetHydrate } from '@utils';
import { getBuildFeatures, updateBuildConditionals } from '../../app-core/app-data';
export const getLazyBuildConditionals = (config, cmps) => {
    const build = getBuildFeatures(cmps);
    build.lazyLoad = true;
    build.hydrateServerSide = false;
    build.transformTagName = config.extras.tagNameTransform;
    build.asyncQueue = config.taskQueue === 'congestionAsync';
    build.taskQueue = config.taskQueue !== 'immediate';
    build.initializeNextTick = config.extras.initializeNextTick;
    const hasHydrateOutputTargets = config.outputTargets.some(isOutputTargetHydrate);
    build.hydrateClientSide = hasHydrateOutputTargets;
    updateBuildConditionals(config, build);
    return build;
};
//# sourceMappingURL=lazy-build-conditionals.js.map