import { BuildCtx, BuildResults } from './build';
import { BuildEvents } from './build-events';
import { Cache } from './cache';
import { CollectionCompilerMeta } from './collection-manifest';
import { ComponentCompilerMeta } from './component-compiler-meta';
import { Config } from './config';
import { DevServer } from './dev-server';
import { FsWatcher } from './fs-watch';
import { InMemoryFileSystem } from './in-memory-fs';
import { ModuleMap } from './module';
import { StyleCompiler } from './style';


export interface Compiler {
  build(): Promise<BuildResults>;
  config: Config;
  docs(): Promise<void>;
  fs: InMemoryFileSystem;
  isValid: boolean;
  startDevServer(): Promise<DevServer>;
}


export interface CompilerCtx {
  activeBuildId: number;
  activeDirsAdded: string[];
  activeDirsDeleted: string[];
  activeFilesAdded: string[];
  activeFilesDeleted: string[];
  activeFilesUpdated: string[];
  cache: Cache;
  cachedStyleMeta: Map<string, StyleCompiler>;
  cachedGlobalStyle: string;
  collections: CollectionCompilerMeta[];
  compilerOptions: any;
  events: BuildEvents;
  fs: InMemoryFileSystem;
  fsWatcher: FsWatcher;
  hasLoggedServerUrl: boolean;
  hasSuccessfulBuild: boolean;
  isActivelyBuilding: boolean;
  lastComponentStyleInput: Map<string, string>;
  lastBuildResults: BuildResults;
  lastBuildStyles: Map<string, string>;
  moduleMap: ModuleMap;
  nodeMap: NodeMap;
  resolvedCollections: Set<string>;
  rollupCacheHydrate: any;
  rollupCacheLazy: any;
  rollupCacheNative: any;
  rootTsFiles: string[];
  styleModeNames: Set<string>;
  tsService: TsService;

  reset(): void;
}

export type NodeMap = WeakMap<any, ComponentCompilerMeta>;

export type TsService = (compilerCtx: CompilerCtx, buildCtx: BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<boolean>;
