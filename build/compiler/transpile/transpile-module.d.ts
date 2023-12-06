import type * as d from '../../declarations';
/**
 * Stand-alone compiling of a single string
 *
 * @param config the Stencil configuration to use in the compilation process
 * @param input the string to compile
 * @param transformOpts a configuration object for how the string is compiled
 * @returns the results of compiling the provided input string
 */
export declare const transpileModule: (config: d.ValidatedConfig, input: string, transformOpts: d.TransformOptions) => d.TranspileModuleResults;
