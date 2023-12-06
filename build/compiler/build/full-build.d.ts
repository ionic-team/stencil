import type * as d from '../../declarations';
/**
 * Build a callable function to perform a full build of a Stencil project
 * @param config a Stencil configuration to apply to a full build of a Stencil project
 * @param compilerCtx the current Stencil compiler context
 * @returns the results of a full build of Stencil
 */
export declare const createFullBuild: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => Promise<d.CompilerBuildResults>;
