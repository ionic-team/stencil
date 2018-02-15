import { BuildEvents } from '../compiler/events';
import { Cache } from '../compiler/cache';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { Collection, ModuleBundles, ModuleFiles } from '../declarations';


export interface CompilerCtx {
  activeBuildId?: number;
  isRebuild?: boolean;
  fs?: InMemoryFileSystem;
  cache?: Cache;
  events?: BuildEvents;
  moduleFiles?: ModuleFiles;
  compiledModuleJsText?: ModuleBundles;
  compiledModuleLegacyJsText?: ModuleBundles;
  collections?: Collection[];
  appFiles?: {
    loader?: string;
    loaderContent?: string;
    core?: string;
    corePolyfilled?: string;
    global?: string;
    registryJson?: string;
  };
  appCoreWWWPath?: string;
  resolvedModuleIds?: string[];

  lastBuildHadError?: boolean;
  hasSuccessfulBuild?: boolean;
  localPrerenderServer?: any;
}
