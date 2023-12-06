import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
/**
 * Main output target function for `dist-custom-elements`. This function just
 * does some organizational work to call the other functions in this module,
 * which do actual work of generating the rollup configuration, creating an
 * entry chunk, running, the build, etc.
 *
 * @param config the validated compiler configuration we're using
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @returns an empty Promise which won't resolve until the work is done!
 */
export declare const outputCustomElements: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
/**
 * Get bundle options for our current build and compiler context which we'll use
 * to generate a Rollup build and so on.
 *
 * @param config a validated Stencil configuration object
 * @param buildCtx the current build context
 * @param compilerCtx the current compiler context
 * @param outputTarget the outputTarget we're currently dealing with
 * @returns bundle options suitable for generating a rollup configuration
 */
export declare const getBundleOptions: (config: d.ValidatedConfig, buildCtx: d.BuildCtx, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDistCustomElements) => BundleOptions;
/**
 * Get bundle options for rollup, run the rollup build, optionally minify the
 * output, and write files to disk.
 *
 * @param config the validated Stencil configuration we're using
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget the outputTarget we're currently dealing with
 * @returns an empty promise
 */
export declare const bundleCustomElements: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCustomElements) => Promise<void>;
/**
 * Create the virtual modules/input modules for the `dist-custom-elements` output target.
 * @param buildCtx the context for the current build
 * @param bundleOpts the bundle options to store the virtual modules under. acts as an output parameter
 * @param outputTarget the configuration for the custom element output target
 */
export declare const addCustomElementInputs: (buildCtx: d.BuildCtx, bundleOpts: BundleOptions, outputTarget: d.OutputTargetDistCustomElements) => void;
/**
 * Generate the entrypoint (`index.ts` file) contents for the `dist-custom-elements` output target
 * @param outputTarget the output target's configuration
 * @param cmpImports The import declarations for local component modules.
 * @param cmpExports The export declarations for local component modules.
 * @param cmpNames The exported component names (could be aliased) from local component modules.
 * @returns the stringified contents to be placed in the entrypoint
 */
export declare const generateEntryPoint: (outputTarget: d.OutputTargetDistCustomElements, cmpImports?: string[], cmpExports?: string[], cmpNames?: string[]) => string;
