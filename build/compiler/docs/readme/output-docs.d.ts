import type * as d from '../../../declarations';
export declare const generateReadme: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, readmeOutputs: d.OutputTargetDocsReadme[], docsData: d.JsonDocsComponent, cmps: d.JsonDocsComponent[]) => Promise<void>;
export declare const generateMarkdown: (userContent: string, cmp: d.JsonDocsComponent, cmps: d.JsonDocsComponent[], readmeOutput: d.OutputTargetDocsReadme) => string;
