import type { TranspileOptions, TranspileResults } from '@stencil/core/internal';
/**
 * The `transpile()` function inputs source code as a string, with various options
 * within the second argument. The function is stateless and returns a `Promise` of the
 * results, including diagnostics and the transpiled code. The `transpile()` function
 * does not handle any bundling, minifying, or precompiling any CSS preprocessing like
 * Sass or Less. The `transpileSync()` equivalent is available so the same function
 * it can be called synchronously. However, TypeScript must be already loaded within
 * the global for it to work, where as the async `transpile()` function will load
 * TypeScript automatically.
 *
 * Since TypeScript is used, the source code will transpile from TypeScript to JavaScript,
 * and does not require Babel presets. Additionally, the results includes an `imports`
 * array of all the import paths found in the source file. The transpile options can be
 * used to set the `module` format, such as `cjs`, and JavaScript `target` version, such
 * as `es2017`.
 *
 * @param code the code to transpile
 * @param opts options for the transpilation process
 * @returns a Promise wrapping the results of the transpilation
 */
export declare const transpile: (code: string, opts?: TranspileOptions) => Promise<TranspileResults>;
/**
 * Synchronous equivalent of the `transpile()` function. When used in a browser
 * environment, TypeScript must already be available globally, where as the async
 * `transpile()` function will load TypeScript automatically.
 *
 * @param code the code to transpile
 * @param opts options for the transpilation process
 * @returns the results of the transpilation
 */
export declare const transpileSync: (code: string, opts?: TranspileOptions) => TranspileResults;
