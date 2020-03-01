
import {
  CompileOptions,
  CompileResults,
  CompileScriptMinifyOptions,
  CompilerBuildResults,
  CompilerNext as Compiler,
  CompilerSystem,
  CompilerWatcher,
  Config,
  Diagnostic,
  LoadConfigInit,
  LoadConfigResults,
  OptimizeCssInput,
  OptimizeCssOutput,
  OptimizeJsInput,
  OptimizeJsOutput,
} from '@stencil/core/internal';

/**
 * The `compile()` function inputs source code as a string, with various options
 * within the second argument. The function returns a Promise of the compile results, including
 * diagnostics and the compiled code. The `compile()` function does not handle any bundling,
 * minifying, or precompiling any CSS preprocessing like Sass or Less. The `compileSync()`
 * equivalent is available so the same function it can be called synchronously, however,
 * TypeScript must be already loaded within the global for it to work, where as the async
 * `compile()` function will load TypeScript automatically.
 *
 * Since TypeScript is used, the compiler is able to transpile from TypeScript to JavaScript,
 * and does not require Babel presets. Additionally, the compile results includes an `imports`
 * array of all the import paths found in the source file. The compile options can be used to set
 * the `module` format, such as `cjs`, and JavaScript `target` version, such as `es2017`.
 */
export declare const compile: (code: string, opts?: CompileOptions) => Promise<CompileResults>;

/**
 * Synchronous equivalent of the `compile()` function. When used in a browser environment, TypeScript must
 * already be available globally, where as the async `compile()` function will load TypeScript automatically.
 */
export declare const compileSync: (code: string, opts?: CompileOptions) => CompileResults;

export declare const createCompiler: (config: Config) => Promise<Compiler>;
export declare const createSystem: () => CompilerSystem;
export declare const dependencies: CompilerDependency[];
export interface CompilerDependency {
  name: string;
  version: string;
  main: string;
}
export declare const optimizeCss: (cssInput?: OptimizeCssInput) => Promise<OptimizeCssOutput>;
export declare const optimizeJs: (jsInput?: OptimizeJsInput) => Promise<OptimizeJsOutput>;
export declare const loadConfig: (init?: LoadConfigInit) => Promise<LoadConfigResults>;
export declare const version: string;

export {
  CompileOptions,
  CompileResults,
  CompileScriptMinifyOptions,
  CompilerBuildResults,
  CompilerWatcher,
  Compiler,
  CompilerSystem,
  Config,
  Diagnostic,
  LoadConfigInit,
  LoadConfigResults,
  OptimizeCssInput,
  OptimizeCssOutput,
  OptimizeJsInput,
  OptimizeJsOutput,
};
