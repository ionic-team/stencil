import type * as d from '../../../declarations';
export declare const parseCollectionManifest: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionName: string, collectionDir: string, collectionJsonStr: string) => d.CollectionCompilerMeta;
export declare const parseCollectionDependencies: (collectionManifest: d.CollectionManifest) => string[];
export declare const parseGlobal: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, collectionDir: string, collectionManifest: d.CollectionManifest, collection: d.CollectionCompilerMeta) => void;
export declare const parseBundles: (collectionManifest: d.CollectionManifest) => {
    components: string[];
}[];
