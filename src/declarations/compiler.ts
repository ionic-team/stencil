import * as d from './index';
import { BuildEvents } from '../compiler/events';
import { Cache } from '../compiler/cache';


export interface CompilerCtx {
  activeBuildId?: number;
  isRebuild?: boolean;
  fs?: d.InMemoryFileSystem;
  cache?: Cache;
  events?: BuildEvents;
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
  hasSuccessfulBuild?: boolean;
  localPrerenderServer?: any;
  hasWatcher?: boolean;
}
