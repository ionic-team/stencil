import type { Plugin } from 'rollup';
import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
/**
 * A Rollup plugin which bundles up some transformation of CSS imports as well
 * as writing some files to disk for the `DIST_COLLECTION` output target.
 *
 * @param config a user-supplied configuration
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param bundleOpts bundle options for Rollup
 * @returns a Rollup plugin which carries out the necessary work
 */
export declare const extTransformsPlugin: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => Plugin;
