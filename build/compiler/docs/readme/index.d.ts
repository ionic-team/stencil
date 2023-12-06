import type * as d from '../../../declarations';
export declare const generateReadmeDocs: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) => Promise<void>;
export declare const strictCheckDocs: (config: d.ValidatedConfig, docsData: d.JsonDocs) => void;
