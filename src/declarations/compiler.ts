import * as d from '.';


export interface Compiler {
  build(): Promise<d.BuildResults>;
  config: d.Config;
  docs(): Promise<void>;
  isValid: boolean;
  startDevServer(): Promise<{ browserUrl: string }>;
}


export interface CompilerCtx {
  activeBuildId?: number;
  appCoreWWWPath?: string;
  appFiles?: {
    core?: string;
    corePolyfilled?: string;
    global?: string;
    registryJson?: string;
  };
  cache?: d.Cache;
  cachedStyleMeta?: Map<string, d.StyleMeta>;
  collections?: d.Collection[];
  compiledModuleJsText?: d.ModuleBundles;
  compiledModuleLegacyJsText?: d.ModuleBundles;
  compilerOptions?: any;
  events?: d.BuildEvents;
  fs?: d.InMemoryFileSystem;
  hasLoggedServerUrl?: boolean;
  hasSuccessfulBuild?: boolean;
  fsWatcher?: d.FsWatcher;
  isActivelyBuilding?: boolean;
  lastBuildConditionalsBrowserEsm?: d.BuildConditionals;
  lastBuildConditionalsBrowserEs5?: d.BuildConditionals;
  lastBuildConditionalsEsmEs5?: d.BuildConditionals;
  lastComponentStyleInput?: Map<string, string>;
  lastBuildHadError?: boolean;
  lastBuildResults?: d.BuildResults;
  lastBuildStyles?: Map<string, string>;
  lastJsModules?: d.JSModuleMap;
  localPrerenderServer?: any;
  moduleFiles?: d.ModuleFiles;
  resolvedCollections?: string[];
  rootTsFiles?: string[];
  tsService?: TsService;
}

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<any>;
