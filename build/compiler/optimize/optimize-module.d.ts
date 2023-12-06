import type { MinifyOptions } from 'terser';
import type { CompilerCtx, Config, OptimizeJsResult, SourceMap, SourceTarget } from '../../declarations';
interface OptimizeModuleOptions {
    input: string;
    sourceMap?: SourceMap;
    sourceTarget?: SourceTarget;
    isCore?: boolean;
    minify?: boolean;
    inlineHelpers?: boolean;
    modeName?: string;
}
/**
 * Begins the process of minifying a user's JavaScript
 * @param config the Stencil configuration file that was provided as a part of the build step
 * @param compilerCtx the current compiler context
 * @param opts minification options that specify how the JavaScript ought to be minified
 * @returns the minified JavaScript result
 */
export declare const optimizeModule: (config: Config, compilerCtx: CompilerCtx, opts: OptimizeModuleOptions) => Promise<OptimizeJsResult>;
/**
 * Builds a configuration object to be used by Terser for the purposes of minifying a user's JavaScript
 * @param config the Stencil configuration file that was provided as a part of the build step
 * @param sourceTarget the version of JavaScript being targeted (e.g. ES2017)
 * @param prettyOutput if true, set the necessary flags to beautify the output of terser
 * @returns the minification options
 */
export declare const getTerserOptions: (config: Config, sourceTarget: SourceTarget, prettyOutput: boolean) => MinifyOptions;
/**
 * This method is likely to be called by a worker on the compiler context, rather than directly.
 * @param input the source code to minify
 * @param minifyOpts options to be used by the minifier
 * @param transpileToEs5 if true, use the TypeScript compiler to transpile the input to ES5 prior to minification
 * @param inlineHelpers when true, emits less terse JavaScript by allowing global helpers created by the TypeScript
 * compiler to be added directly to the transpiled source. Used only if `transpileToEs5` is true.
 * @returns minified input, as JavaScript
 */
export declare const prepareModule: (input: string, minifyOpts: MinifyOptions, transpileToEs5: boolean, inlineHelpers: boolean) => Promise<OptimizeJsResult>;
export {};
