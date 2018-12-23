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
  rollupCache?: any;
  cachedStyleMeta?: Map<string, d.StyleMeta>;
  collections?: d.CollectionCompilerMeta[];
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
  lastBuildConditionalsEsmEs2017?: d.BuildConditionals;
  lastComponentStyleInput?: Map<string, string>;
  lastBuildHadError?: boolean;
  lastBuildResults?: d.BuildResults;
  lastBuildStyles?: Map<string, string>;
  lastRawModules?: d.DerivedModule[];
  localPrerenderServer?: any;

  /** OLD moduleFile object, migrate to use moduleMap instead */
  moduleFiles?: d.ModuleFiles;

  moduleMap?: d.ModuleMap;

  resolvedCollections?: string[];
  rootTsFiles?: string[];
  tsService?: TsService;
}

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[], checkCacheKey: boolean, useFsCache: boolean) => Promise<any>;
