import * as d from '../../declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem, normalizePath } from '@utils';


/**
 * The CompilerCtx is a persistent object that's reused throughout
 * all builds and rebuilds. The data within this object is used
 * for in-memory caching, and can be reset, but the object itself
 * is always the same.
 */
export class CompilerContext implements d.CompilerCtx {
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
  events = new BuildEvents();
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

  constructor(config: d.Config) {
    const cacheFs = (config.enableCache && config.sys.fs != null) ? new InMemoryFileSystem(config.sys.fs, config.sys.path) : null;
    this.cache = new Cache(config, cacheFs);

    this.cache.initCacheDir();

    this.fs = (config.sys.fs != null ? new InMemoryFileSystem(config.sys.fs, config.sys.path) : null);
  }

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


export function getModule(config: d.Config, compilerCtx: d.CompilerCtx, sourceFilePath: string) {
  sourceFilePath = normalizePath(sourceFilePath);

  const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
  if (moduleFile != null) {
    return moduleFile;

  } else {
    const p = config.sys.path.parse(sourceFilePath);
    const moduleFile: d.Module = {
      sourceFilePath: sourceFilePath,
      jsFilePath: config.sys.path.join(p.dir, p.name + '.js'),
      cmps: [],
      collectionName: null,
      dtsFilePath: null,
      excludeFromCollection: false,
      externalImports: [],
      hasVdomAttribute: false,
      hasVdomClass: false,
      hasVdomFunctional: false,
      hasVdomKey: false,
      hasVdomListener: false,
      hasVdomRef: false,
      hasVdomRender: false,
      hasVdomStyle: false,
      hasVdomText: false,
      htmlAttrNames: [],
      htmlTagNames: [],
      isCollectionDependency: false,
      isLegacy: false,
      localImports: [],
      originalCollectionComponentPath: null,
      potentialCmpRefs: []
    };
    compilerCtx.moduleMap.set(sourceFilePath, moduleFile);
    return moduleFile;
  }
}


export function resetModule(moduleFile: d.Module) {
  moduleFile.cmps.length = 0;
  moduleFile.collectionName = null;
  moduleFile.dtsFilePath = null;
  moduleFile.excludeFromCollection = false;
  moduleFile.externalImports.length = 0;
  moduleFile.isCollectionDependency = false;
  moduleFile.localImports.length = 0;
  moduleFile.originalCollectionComponentPath = null;

  moduleFile.hasVdomAttribute = true;
  moduleFile.hasVdomClass = true;
  moduleFile.hasVdomFunctional = true;
  moduleFile.hasVdomKey = true;
  moduleFile.hasVdomListener = true;
  moduleFile.hasVdomRef = true;
  moduleFile.hasVdomRender = false;
  moduleFile.hasVdomStyle = true;
  moduleFile.hasVdomText = true;
  moduleFile.htmlAttrNames.length = 0;
  moduleFile.htmlTagNames.length = 0;
  moduleFile.potentialCmpRefs.length = 0;
}
