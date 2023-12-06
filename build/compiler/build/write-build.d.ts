import type * as d from '../../declarations';
/**
 * Writes files to disk as a result of compilation
 * @param config the Stencil configuration used for the build
 * @param compilerCtx the compiler context associated with the build
 * @param buildCtx the build context associated with the current build
 */
export declare const writeBuild: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
