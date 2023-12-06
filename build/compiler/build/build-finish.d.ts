import type * as d from '../../declarations';
/**
 * Finish a build as having completed successfully
 * @param buildCtx the build context for the build being aborted
 * @returns the build results
 */
export declare const buildFinish: (buildCtx: d.BuildCtx) => Promise<d.CompilerBuildResults>;
/**
 * Finish a build early due to failure. During the build process, a fatal error has occurred where the compiler cannot
 * continue further
 * @param buildCtx the build context for the build being aborted
 * @returns the build results
 */
export declare const buildAbort: (buildCtx: d.BuildCtx) => Promise<d.CompilerBuildResults>;
