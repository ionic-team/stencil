import type * as d from '../../../declarations';
export declare const generateJsonDocs: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) => Promise<void>;
export declare const writeDocsOutput: (compilerCtx: d.CompilerCtx, jsonOutput: d.OutputTargetDocsJson, jsonContent: string, typesContent: string) => Promise<[import("../..").FsWriteResults, any]>;
