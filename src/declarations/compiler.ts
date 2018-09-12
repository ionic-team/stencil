import * as d from '.';


export interface Compiler {
  build(): Promise<d.BuildResults>;
  config: d.Config;
  docs(): Promise<void>;
  isValid: boolean;
  startDevServer(): Promise<d.DevServer>;
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
  hasWatch?: boolean;
  isActivelyBuilding?: boolean;
  lastBuildConditionalsBrowserEsm?: d.BuildConditionals;
  lastBuildConditionalsBrowserEs5?: d.BuildConditionals;
  lastBuildConditionalsEsmEs5?: d.BuildConditionals;
  lastComponentStyleInput?: Map<string, string>;
  lastBuildHadError?: boolean;
  lastBuildResults?: d.BuildResults;
  lastBuildStyles?: Map<string, string>;
  lastRawModules?: d.DerivedModule[];
  localPrerenderServer?: any;
  moduleFiles?: d.ModuleFiles;
  resolvedCollections?: string[];
  rootTsFiles?: string[];
  tsService?: TsService;
}

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<any>;
