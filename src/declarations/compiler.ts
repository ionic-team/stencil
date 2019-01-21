import * as d from '.';


export interface Compiler {
  build(): Promise<d.BuildResults>;
  config: d.Config;
  docs(): Promise<void>;
  isValid: boolean;
  startDevServer(): Promise<d.DevServer>;
}


export interface CompilerCtx {
  activeBuildId: number;
  cache: d.Cache;
  cachedStyleMeta: Map<string, d.StyleCompiler>;
  collections: d.CollectionCompilerMeta[];
  compilerOptions: any;
  events: d.BuildEvents;
  fs: d.InMemoryFileSystem;
  fsWatcher?: d.FsWatcher;
  hasLoggedServerUrl: boolean;
  hasSuccessfulBuild: boolean;
  isActivelyBuilding: boolean;
  lastComponentStyleInput: Map<string, string>;
  lastBuildHadError: boolean;
  lastBuildResults: d.BuildResults;
  lastBuildStyles: Map<string, string>;
  lastDerivedModules: d.DerivedModule[];
  localPrerenderServer: any;
  moduleMap: d.ModuleMap;
  resolvedCollections: Set<string>;
  rollupCache?: any;
  rootTsFiles: string[];
  tsService: TsService;

  reset(): void;
}

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<any>;
