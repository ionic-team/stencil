import * as d from '../../declarations';
import { buildEvents } from '../../compiler/events';


/**
 * The CompilerCtx is a persistent object that's reused throughout
 * all builds and rebuilds. The data within this object is used
 * for in-memory caching, and can be reset, but the object itself
 * is always the same.
 */
export class CompilerContext implements d.CompilerCtx {
  version = 2;
  activeBuildId = -1;
  activeFilesAdded: string[] = [];
  activeFilesDeleted: string[] = [];
  activeFilesUpdated: string[] = [];
  activeDirsAdded: string[] = [];
  activeDirsDeleted: string[] = [];
  cache: d.Cache;
  cachedStyleMeta = new Map<string, d.StyleCompiler>();
  collections: d.CollectionCompilerMeta[] = [];
  compilerOptions: any = null;
  events = buildEvents();
  fs: d.InMemoryFileSystem;
  fsWatcher: d.FsWatcher = null;
  hasFsWatcherEvents = false;
  hasLoggedServerUrl = false;
  hasSuccessfulBuild = false;
  isActivelyBuilding = false;
  lastBuildResults: d.BuildResults = null;
  lastBuildStyles = new Map<string, string>();
  lastComponentStyleInput = new Map<string, string>();
  moduleMap: d.ModuleMap = new Map();
  nodeMap = new WeakMap();
  resolvedCollections = new Set<string>();
  rollupCacheHydrate: any = null;
  rollupCacheLazy: any = null;
  rollupCacheNative: any = null;
  rootTsFiles: string[] = [];
  tsService: d.TsService = null;
  cachedGlobalStyle: string;
  styleModeNames = new Set<string>();
  rollupCache = new Map();
  changedModules = new Set<string>();
  changedFiles = new Set<string>();
  worker: d.CompilerWorkerContext = null;

  reset() {
    this.cache.clear();
    this.cachedStyleMeta.clear();
    this.cachedGlobalStyle = null;
    this.collections.length = 0;
    this.compilerOptions = null;
    this.lastComponentStyleInput.clear();
    this.rollupCacheHydrate = null;
    this.rollupCacheLazy = null;
    this.rollupCacheNative = null;
    this.moduleMap.clear();
    this.resolvedCollections.clear();
    this.rootTsFiles.length = 0;
    this.tsService = null;

    if (this.fs != null) {
      this.fs.clearCache();
    }
  }
}
