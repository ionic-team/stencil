import type * as d from '../../declarations';
import { InMemoryFileSystem } from '../sys/in-memory-fs';
/**
 * The CompilerCtx is a persistent object that's reused throughout
 * all builds and rebuilds. The data within this object is used
 * for in-memory caching, and can be reset, but the object itself
 * is always the same.
 */
export declare class CompilerContext implements d.CompilerCtx {
    version: number;
    activeBuildId: number;
    activeFilesAdded: string[];
    activeFilesDeleted: string[];
    activeFilesUpdated: string[];
    activeDirsAdded: string[];
    activeDirsDeleted: string[];
    addWatchDir: (path: string) => void;
    addWatchFile: (path: string) => void;
    cache: d.Cache;
    cssModuleImports: Map<string, string[]>;
    changedFiles: Set<string>;
    changedModules: Set<string>;
    collections: d.CollectionCompilerMeta[];
    compilerOptions: any;
    events: d.BuildEvents;
    fs: InMemoryFileSystem;
    hasSuccessfulBuild: boolean;
    isActivelyBuilding: boolean;
    lastBuildResults: d.CompilerBuildResults;
    moduleMap: d.ModuleMap;
    nodeMap: WeakMap<object, any>;
    resolvedCollections: Set<string>;
    rollupCache: Map<any, any>;
    rollupCacheHydrate: any;
    rollupCacheLazy: any;
    rollupCacheNative: any;
    cachedGlobalStyle: string;
    styleModeNames: Set<string>;
    worker: d.CompilerWorkerContext;
    reset(): void;
}
export declare const getModuleLegacy: (compilerCtx: d.CompilerCtx, sourceFilePath: string) => d.Module;
export declare const resetModuleLegacy: (moduleFile: d.Module) => void;
