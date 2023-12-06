import type { BuildResultsComponentGraph, Diagnostic, ValidatedConfig } from '../declarations';
import type { CoreCompiler } from './load-compiler';
export declare const taskPrerender: (coreCompiler: CoreCompiler, config: ValidatedConfig) => Promise<void>;
export declare const runPrerenderTask: (coreCompiler: CoreCompiler, config: ValidatedConfig, hydrateAppFilePath: string, componentGraph: BuildResultsComponentGraph, srcIndexHtmlPath: string) => Promise<Diagnostic[]>;
