import type * as d from '../../declarations';
export declare function normalizeHydrateOptions(inputOpts: d.HydrateDocumentOptions): d.HydrateFactoryOptions;
export declare function generateHydrateResults(opts: d.HydrateDocumentOptions): d.HydrateResults;
export declare const createHydrateBuildId: () => string;
export declare function renderBuildDiagnostic(results: d.HydrateResults, level: 'error' | 'warn' | 'info' | 'log' | 'debug', header: string, msg: string): d.Diagnostic;
export declare function renderBuildError(results: d.HydrateResults, msg: string): d.Diagnostic;
export declare function renderCatchError(results: d.HydrateResults, err: any): d.Diagnostic;
