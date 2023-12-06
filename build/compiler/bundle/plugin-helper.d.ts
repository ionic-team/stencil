import type * as d from '../../declarations';
export declare const pluginHelper: (config: d.ValidatedConfig, builtCtx: d.BuildCtx, platform: string) => {
    name: string;
    resolveId(importee: string, importer: string): null;
};
