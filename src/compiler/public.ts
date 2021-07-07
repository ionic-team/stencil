import {
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
  TranspileOptions,
  TranspileResults,
  PrerenderStartOptions,
  PrerenderResults,
} from '@stencil/core/internal';

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
 */
export declare const transpile: (code: string, opts?: TranspileOptions) => Promise<TranspileResults>;

/**
 * Synchronous equivalent of the `transpile()` function. When used in a browser
 * environment, TypeScript must already be available globally, where as the async
 * `transpile()` function will load TypeScript automatically.
 */
export declare const transpileSync: (code: string, opts?: TranspileOptions) => TranspileResults;

/**
 * The compiler is the utility that brings together many tools to build optimized components,
 * such as a transpiler, bundler, and minifier, along with many internal optimizations to
 * create small efficient compoennts. When using the CLI, the `stencil build` command uses
 * the compiler for the various builds, such as a production build, or watch mode during
 * development. If only one file should be transformed then the `transpile()` function
 * should be used instead.
 *
 * Given a Stencil config, this method asynchronously returns a `Compiler` instance. The
 * config provided should already be created using the `loadConfig({...})` method.
 */
export declare const createCompiler: (config: Config) => Promise<Compiler>;

export declare const createPrerenderer: (
  config: Config,
) => Promise<{ start: (opts: PrerenderStartOptions) => Promise<PrerenderResults> }>;

/**
 * The compiler uses a `CompilerSystem` instance to access any file system reads and writes.
 * When used from the CLI, the CLI will provide its own system based on NodeJS. This method
 * provide a compiler system is in-memory only and independent of any platform.
 */
export declare const createSystem: () => CompilerSystem;

/**
 * The `dependencies` array is only informational and provided to state which versions of
 * dependencies the compiler was built and works with. For example, the version of TypeScript,
 * Rollup and Terser used for this version of Stencil are listed here.
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
 */
export declare const path: PlatformPath;

/**
 * Current version of `@stencil/core`.
 */
export declare const version: string;

export declare const versions: {
  stencil: string;
  typescript: string;
  rollup: string;
  terser: string;
};

/**
 * Current version's emoji :)
 */
export declare const vermoji: string;

/**
 * Compiler's unique build ID.
 */
export declare const buildId: string;

export {
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
  TranspileOptions,
  TranspileResults,
};
