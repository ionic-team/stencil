import type * as d from '../../../declarations';
export declare const writeLazyModule: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, outputTargetType: string, destinations: string[], entryModule: d.EntryModule, shouldHash: boolean, code: string, sourceMap: d.SourceMap, sufix: string) => Promise<d.BundleModuleOutput>;
