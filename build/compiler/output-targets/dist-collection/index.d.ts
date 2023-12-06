import type * as d from '../../../declarations';
/**
 * Main output target function for `dist-collection`. This function takes the compiled output from a
 * {@link ts.Program}, runs each file through a transformer to transpile import path aliases, and then writes
 * the output code and source maps to disk in the specified collection directory.
 *
 * @param config The validated Stencil config.
 * @param compilerCtx The current compiler context.
 * @param buildCtx The current build context.
 * @param changedModuleFiles The changed modules returned from the TS compiler.
 * @returns An empty promise. Resolved once all functions finish.
 */
export declare const outputCollection: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, changedModuleFiles: d.Module[]) => Promise<void>;
