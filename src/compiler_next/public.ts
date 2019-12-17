
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
} from '@stencil/core/internal';

export declare const compile: (code: string, opts?: CompileOptions) => Promise<CompileResults>;
export declare const createCompiler: (config: Config) => Promise<Compiler>;
export declare const createSystem: () => CompilerSystem;
export declare const dependencies: CompilerDependency[];
export interface CompilerDependency {
  name: string;
  version: string;
  main: string;
}
export declare const getMinifyScriptOptions: (opts?: CompileScriptMinifyOptions) => {
  options: any;
  minifier: {
    name: string;
    version: string;
    url: string;
  };
};
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
};
