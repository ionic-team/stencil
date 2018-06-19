import * as d from './index';


export interface CompilerCtx {
  activeBuildId?: number;
  fs?: d.InMemoryFileSystem;
  cache?: d.Cache;
  events?: d.BuildEvents;
  moduleFiles?: d.ModuleFiles;
  compiledModuleJsText?: d.ModuleBundles;
  compiledModuleLegacyJsText?: d.ModuleBundles;
  compilerOptions?: any;
  collections?: d.Collection[];
  appFiles?: {
    core?: string;
    corePolyfilled?: string;
    global?: string;
    registryJson?: string;
  };
  appCoreWWWPath?: string;
  resolvedCollections?: string[];

  hasSuccessfulBuild?: boolean;
  localPrerenderServer?: any;
  lastBuildResults?: d.BuildResults;
  hasWatcher?: boolean;
  tsService?: TsService;
  rootTsFiles?: string[];

  lastBuildHadError?: boolean;
  lastBuildConditionalsBrowserEsm?: d.BuildConditionals;
  lastBuildConditionalsBrowserEs5?: d.BuildConditionals;
  lastBuildConditionalsEsmEs5?: d.BuildConditionals;
  lastJsModules?: d.JSModuleMap;
  lastBuildStyles?: { [styleId: string]: string };
  lastStyleText?: { [absPath: string]: string };

  entryBundleCache?: any;
}

export type TsService = (compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsFilePaths: string[]) => Promise<any>;
