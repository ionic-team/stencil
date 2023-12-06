import type { Config, ImportData, TransformCssToEsmInput, TransformOptions, TranspileOptions, TranspileResults } from '../../declarations';
export declare const getTranspileResults: (code: string, input: TranspileOptions) => {
    importData: ImportData;
    results: TranspileResults;
};
/**
 * Configuration necessary for transpilation
 */
interface TranspileConfig {
    compileOpts: TranspileOptions;
    config: Config;
    transformOpts: TransformOptions;
}
/**
 * Get configuration necessary to carry out transpilation, including a Stencil
 * configuration, transformation options, and transpilation options.
 *
 * @param input options for Stencil's transpiler (string-to-string compiler)
 * @returns the options and configuration necessary for transpilation
 */
export declare const getTranspileConfig: (input: TranspileOptions) => TranspileConfig;
export declare const getTranspileCssConfig: (compileOpts: TranspileOptions, importData: ImportData, results: TranspileResults) => TransformCssToEsmInput;
export {};
