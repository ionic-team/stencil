import type * as d from '../../declarations';
/**
 * Build a diagnostic for an error resulting from a particular field in a
 * package.json file
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param msg an error string
 * @param jsonField the key for the field which caused the error, used for
 * finding the error line in the original JSON file
 * @returns a diagnostic object
 */
export declare const packageJsonError: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, msg: string, jsonField: string) => d.Diagnostic;
/**
 * Build a diagnostic for a warning resulting from a particular field in a
 * package.json file
 *
 * @param config the stencil config
 * @param compilerCtx the current compiler context
 * @param buildCtx the current build context
 * @param msg an error string
 * @param jsonField the key for the field which caused the error, used for
 * finding the error line in the original JSON file
 * @returns a diagnostic object
 */
export declare const packageJsonWarn: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, msg: string, jsonField: string) => d.Diagnostic;
