import type * as d from '../../declarations';
/**
 * Validate the package.json file for a project, checking that various fields
 * are set correctly for the currently-configured output targets.
 *
 * @param config the project's Stencil config
 * @param compilerCtx the compiler context
 * @param buildCtx the build context
 * @returns an empty Promise
 */
export declare const validateBuildPackageJson: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
/**
 * Validate that the `files` field in `package.json` contains directories and
 * files that are necessary for the `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export declare const validatePackageFiles: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => Promise<void>;
/**
 * Check that the `main` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export declare const validateMain: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => void;
/**
 * Check that the `collection` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param outputTarget a DIST_COLLECTION output target
 */
export declare const validateCollection: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => void;
/**
 * Check that the `browser` field is set correctly in `package.json` for the
 * `DIST_COLLECTION` output target.
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 */
export declare const validateBrowser: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => void;
