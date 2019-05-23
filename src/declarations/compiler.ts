import * as d from '.';
import ts from 'typescript';

export interface Compiler {
  build(): Promise<d.BuildResults>;
  config: d.Config;
  docs(): Promise<void>;
  fs: d.InMemoryFileSystem;
  isValid: boolean;
  startDevServer(): Promise<d.DevServer>;
}


export interface CompilerCtx {
  activeBuildId: number;
  activeDirsAdded: string[];
  activeDirsDeleted: string[];
  activeFilesAdded: string[];
  activeFilesDeleted: string[];
  activeFilesUpdated: string[];
  cache: d.Cache;
  cachedStyleMeta: Map<string, d.StyleCompiler>;
  cachedGlobalStyle: string;
  collections: d.CollectionCompilerMeta[];
  compilerOptions: any;
  events: d.BuildEvents;
  fs: d.InMemoryFileSystem;
  fsWatcher: d.FsWatcher;
  hasLoggedServerUrl: boolean;
  hasSuccessfulBuild: boolean;
  isActivelyBuilding: boolean;
  lastComponentStyleInput: Map<string, string>;
  lastBuildResults: d.BuildResults;
  lastBuildStyles: Map<string, string>;
  moduleMap: d.ModuleMap;
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

export type NodeMap = WeakMap<ts.ClassDeclaration, d.ComponentCompilerMeta>;

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<boolean>;
