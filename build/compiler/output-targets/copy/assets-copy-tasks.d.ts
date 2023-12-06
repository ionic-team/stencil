import type * as d from '../../../declarations';
export declare const getComponentAssetsCopyTasks: (config: d.ValidatedConfig, buildCtx: d.BuildCtx, dest: string, collectionsPath: boolean) => Required<d.CopyTask>[];
export declare const canSkipAssetsCopy: (compilerCtx: d.CompilerCtx, entryModules: d.EntryModule[], filesChanged: string[]) => boolean;
