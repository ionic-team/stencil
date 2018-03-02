import * as d from './index';
import { BuildEvents } from '../compiler/events';
import { Cache } from '../compiler/cache';
import { InMemoryFileSystem } from '../util/in-memory-fs';


export interface CompilerCtx {
  activeBuildId?: number;
  isRebuild?: boolean;
  fs?: InMemoryFileSystem;
  cache?: Cache;
  events?: BuildEvents;
  moduleFiles?: d.ModuleFiles;
  compiledModuleJsText?: d.ModuleBundles;
  compiledModuleLegacyJsText?: d.ModuleBundles;
  collections?: d.Collection[];
  appFiles?: {
    loader?: string;
    loaderContent?: string;
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
