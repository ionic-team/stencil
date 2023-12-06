import type * as d from '../../declarations';
/**
 * Retrieve the component bundle groupings to be used when generating output
 * @param config the Stencil configuration used for the build
 * @param buildCtx the current build context
 * @param cmps the components that have been registered & defined for the current build
 * @returns the component bundling data
 */
export declare function getDefaultBundles(config: d.ValidatedConfig, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]): readonly d.ComponentCompilerMeta[][];
/**
 * Retrieve and validate the `bundles` field on a project's Stencil configuration file
 * @param config the configuration file with a `bundles` field to inspect
 * @param buildCtx the current build context
 * @param cmps the components that have been registered & defined for the current build
 * @returns a three dimensional array with the compiler metadata for each component used
 */
export declare function getUserConfigBundles(config: d.ValidatedConfig, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[]): readonly d.ComponentCompilerMeta[][];
