import { BuildEvents } from '../compiler/events';
import { Cache } from '../compiler/cache';
import { InMemoryFileSystem } from '../util/in-memory-fs';
import { Manifest, ModuleBundles, ModuleFiles } from '../declarations';


export interface CompilerCtx {
  activeBuildId?: number;
  isRebuild?: boolean;
  fs?: InMemoryFileSystem;
  cache?: Cache;
  events?: BuildEvents;
  moduleFiles?: ModuleFiles;
  rollupCache?: { [cacheKey: string]: any };
  compiledModuleJsText?: ModuleBundles;
  compiledModuleLegacyJsText?: ModuleBundles;
  collections?: { [name: string]: Manifest };
  appFiles?: {
    loader?: string;
    loaderContent?: string;
    core?: string;
    corePolyfilled?: string;
    global?: string;
    registryJson?: string;
  };
  appCoreWWWPath?: string;

  lastBuildHadError?: boolean;
  hasSuccessfulBuild?: boolean;
  localPrerenderServer?: any;
}
