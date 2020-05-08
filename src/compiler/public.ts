import {
  CompileOptions,
  CompileResults,
  CompileScriptMinifyOptions,
  CompilerBuildResults,
  Compiler,
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
  PlatformPath,
} from '@stencil/core/internal';

/**
 * The `compile()` function inputs source code as a string, with various options
 * within the second argument. The function returns a `Promise` of the compile results, including
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

/**
 * The compiler is the utility that brings together many tools to build optimized components, such as a
 * transpiler, bundler and minifier. When using the CLI, the `stencil build` command uses the compiler for
 * the various builds, such as a production build, or watch mode during development. If only one file should
 * be compiled then the `compiler()` function should be used instead.
 *
 * Given a Stencil config, this method asynchronously returns a `Compiler` instance. The config provided
 * should already be created using the `loadConfig({...})` method.
 */
export declare const createCompiler: (config: Config) => Promise<Compiler>;

/**
 * The compiler uses a `CompilerSystem` instance to access any file system reads and writes. When used
 * from the CLI, the CLI will provide its own system based on NodeJS. This method provide a compiler
 * system is in-memory only and independent of any platform.
 */
export declare const createSystem: () => CompilerSystem;

/**
 * The `dependencies` array is only informational and provided to state which versions of dependencies
 * the compiler was built and works with. For example, the version of TypeScript, Rollup and Terser used
 * for this version of Stencil are listed here.
 */
export declare const dependencies: CompilerDependency[];
export interface CompilerDependency {
  name: string;
  version: string;
  main: string;
  resources?: string[];
}

/**
 * The `loadConfig(init)` method is used to take raw config information and transform it into a
 * usable config object for the compiler and dev-server. The `init` argument should be given
 * an already created system and logger which can also be used by the compiler.
 */
export declare const loadConfig: (init?: LoadConfigInit) => Promise<LoadConfigResults>;

/**
 * Utility function used by the compiler to optimize CSS.
 */
export declare const optimizeCss: (cssInput?: OptimizeCssInput) => Promise<OptimizeCssOutput>;

/**
 * Utility function used by the compiler to optimize JavaScript. Knowing the JavaScript target
 * will further apply minification optimizations beyond usual minification.
 */
export declare const optimizeJs: (jsInput?: OptimizeJsInput) => Promise<OptimizeJsOutput>;

/**
 * Utility of the `path` API providied by NodeJS, but capable of running in any environment.
 * This `path` API is only the POSIX version: https://nodejs.org/api/path.html
 */
export declare const path: PlatformPath;

/**
 * Current version of `@stencil/core`.
 */
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
