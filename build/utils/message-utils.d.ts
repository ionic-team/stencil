import type * as d from '../declarations';
/**
 * Builds a template `Diagnostic` entity for a build error. The created `Diagnostic` is returned, and have little
 * detail attached to it regarding the specifics of the error - it is the responsibility of the caller of this method
 * to attach the specifics of the error message.
 *
 * The created `Diagnostic` is pushed to the `diagnostics` argument as a side effect of calling this method.
 *
 * @param diagnostics the existing diagnostics that the created template `Diagnostic` should be added to
 * @returns the created `Diagnostic`
 */
export declare const buildError: (diagnostics?: d.Diagnostic[]) => d.Diagnostic;
/**
 * Builds a template `Diagnostic` entity for a build warning. The created `Diagnostic` is returned, and have little
 * detail attached to it regarding the specifics of the warning - it is the responsibility of the caller of this method
 * to attach the specifics of the warning message.
 *
 * The created `Diagnostic` is pushed to the `diagnostics` argument as a side effect of calling this method.
 *
 * @param diagnostics the existing diagnostics that the created template `Diagnostic` should be added to
 * @returns the created `Diagnostic`
 */
export declare const buildWarn: (diagnostics: d.Diagnostic[]) => d.Diagnostic;
/**
 * Create a diagnostic message suited for representing an error in a JSON
 * file. This includes information about the exact lines in the JSON file which
 * caused the error and the path to the file.
 *
 * @param compilerCtx the current compiler context
 * @param diagnostics a list of diagnostics used as a return param
 * @param jsonFilePath the path to the JSON file where the error occurred
 * @param msg the error message
 * @param jsonField the key for the field which caused the error, used for finding
 * the error line in the original JSON file
 * @returns a reference to the newly-created diagnostic
 */
export declare const buildJsonFileError: (compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], jsonFilePath: string, msg: string, jsonField: string) => d.Diagnostic;
/**
 * Builds a diagnostic from an `Error`, appends it to the `diagnostics` parameter, and returns the created diagnostic
 * @param diagnostics the series of diagnostics the newly created diagnostics should be added to
 * @param err the error to derive information from in generating the diagnostic
 * @param msg an optional message to use in place of `err` to generate the diagnostic
 * @returns the generated diagnostic
 */
export declare const catchError: (diagnostics: d.Diagnostic[], err: Error | null | undefined, msg?: string) => d.Diagnostic;
/**
 * Determine if the provided diagnostics have any build errors
 * @param diagnostics the diagnostics to inspect
 * @returns true if any of the diagnostics in the list provided are errors that did not occur at runtime. false
 * otherwise.
 */
export declare const hasError: (diagnostics: d.Diagnostic[]) => boolean;
/**
 * Determine if the provided diagnostics have any warnings
 * @param diagnostics the diagnostics to inspect
 * @returns true if any of the diagnostics in the list provided are warnings. false otherwise.
 */
export declare const hasWarning: (diagnostics: d.Diagnostic[]) => boolean;
export declare const shouldIgnoreError: (msg: any) => boolean;
export declare const TASK_CANCELED_MSG = "task canceled";
