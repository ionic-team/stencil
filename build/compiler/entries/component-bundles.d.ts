import type * as d from '../../declarations';
/**
 * Generate the bundles that will be used during the bundling process
 *
 * This gathers information about all of the components used in the build,
 * including the bundles which will be included by default, and then returns a
 * deduplicated list of all the bundles which need to be present.
 *
 * @param config the Stencil configuration used for the build
 * @param buildCtx the current build context
 * @returns the bundles to be used during the bundling process
 */
export declare function generateComponentBundles(config: d.ValidatedConfig, buildCtx: d.BuildCtx): readonly d.ComponentCompilerMeta[][];
