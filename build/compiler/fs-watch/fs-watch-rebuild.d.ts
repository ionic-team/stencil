import type * as d from '../../declarations';
export declare const filesChanged: (buildCtx: d.BuildCtx) => string[];
/**
 * Helper to check if a filepath has a script extension
 *
 * @param filePath a file extension
 * @returns whether the filepath has a script extension or not
 */
export declare const hasScriptExt: (filePath: string) => boolean;
/**
 * Helper to check if a filepath has a style extension
 *
 * @param filePath a file extension to check
 * @returns whether the filepath has a style extension or not
 */
export declare const hasStyleExt: (filePath: string) => boolean;
/**
 * Get all scripts from a build context that were added
 *
 * @param buildCtx the build context
 * @returns an array of filepaths that were added
 */
export declare const scriptsAdded: (buildCtx: d.BuildCtx) => string[];
/**
 * Get all scripts from a build context that were deleted
 *
 * @param buildCtx the build context
 * @returns an array of deleted filepaths
 */
export declare const scriptsDeleted: (buildCtx: d.BuildCtx) => string[];
/**
 * Check whether a build has script changes
 *
 * @param buildCtx the build context
 * @returns whether or not there are script changes
 */
export declare const hasScriptChanges: (buildCtx: d.BuildCtx) => boolean;
/**
 * Check whether a build has style changes
 *
 * @param buildCtx the build context
 * @returns whether or not there are style changes
 */
export declare const hasStyleChanges: (buildCtx: d.BuildCtx) => boolean;
/**
 * Check whether a build has html changes
 *
 * @param config the current config
 * @param buildCtx the build context
 * @returns whether or not HTML files were changed
 */
export declare const hasHtmlChanges: (config: d.ValidatedConfig, buildCtx: d.BuildCtx) => boolean;
export declare const updateCacheFromRebuild: (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => void;
export declare const isWatchIgnorePath: (config: d.ValidatedConfig, path: string) => boolean;
