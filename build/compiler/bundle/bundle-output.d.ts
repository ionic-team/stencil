import { RollupOptions } from 'rollup';
import type * as d from '../../declarations';
import type { BundleOptions } from './bundle-interface';
export declare const bundleOutput: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => Promise<import("rollup").RollupBuild>;
/**
 * Build the rollup options that will be used to transpile, minify, and otherwise transform a Stencil project
 * @param config the Stencil configuration for the project
 * @param compilerCtx the current compiler context
 * @param buildCtx a context object containing information about the current build
 * @param bundleOpts Rollup bundling options to apply to the base configuration setup by this function
 * @returns the rollup options to be used
 */
export declare const getRollupOptions: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => RollupOptions;
