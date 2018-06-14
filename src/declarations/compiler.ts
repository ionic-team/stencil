import * as d from './index';


export interface CompilerCtx {
  activeBuildId?: number;
  isRebuild?: boolean;
  fs?: d.InMemoryFileSystem;
  cache?: d.Cache;
  events?: d.BuildEvents;
  moduleFiles?: d.ModuleFiles;
  compiledModuleJsText?: d.ModuleBundles;
  compiledModuleLegacyJsText?: d.ModuleBundles;
  collections?: d.Collection[];
  appFiles?: {
    core?: string;
    corePolyfilled?: string;
    global?: string;
    registryJson?: string;
  };
  appCoreWWWPath?: string;
  resolvedCollections?: string[];

  lastBuildHadError?: boolean;
  lastBuildConditionalsBrowserEsm?: d.BuildConditionals;
  lastBuildConditionalsBrowserEs5?: d.BuildConditionals;
  lastBuildConditionalsEsmEs5?: d.BuildConditionals;
  hasSuccessfulBuild?: boolean;
  localPrerenderServer?: any;
  hasWatcher?: boolean;
  tsService?: TsService;
  rootTsFiles?: string[];
}

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[]) => Promise<any>;
