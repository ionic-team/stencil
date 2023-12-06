import type * as d from '../../../declarations';
export declare const parseCollectionComponents: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) => void;
export declare const transpileCollectionModule: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collection: d.CollectionCompilerMeta, inputFileName: string) => d.Module;
