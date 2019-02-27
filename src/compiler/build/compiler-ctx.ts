import * as d from '@declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem, normalizePath } from '@utils';
import { sys } from '@sys';


/**
 * The CompilerCtx is a persistent object that's reused throughout
 * all builds and rebuilds. The data within this object is used
 * for in-memory caching, and can be reset, but the object itself
 * is always the same.
 */
export class CompilerContext implements d.CompilerCtx {
  activeBuildId = -1;
  cache: d.Cache;
  cachedStyleMeta = new Map<string, d.StyleCompiler>();
  collections: d.CollectionCompilerMeta[] = [];
  compilerOptions: any = null;
  events = new BuildEvents();
  fs: d.InMemoryFileSystem;
  fsWatcher: d.FsWatcher = null;
  hasLoggedServerUrl = false;
  hasSuccessfulBuild = false;
  isActivelyBuilding = false;
  lastBuildHadError = false;
  lastBuildResults: d.BuildResults = null;
  lastBuildStyles = new Map<string, string>();
  lastComponentStyleInput = new Map<string, string>();
  lazyModuleRollupCache: any = null;
  localPrerenderServer: any = null;
  moduleMap: d.ModuleMap = new Map();
  nodeMap = new WeakMap();
  resolvedCollections = new Set<string>();
  rootTsFiles: string[] = [];
  tsService: d.TsService = null;

  constructor(config: d.Config) {
    const cacheFs = config.enableCache ? new InMemoryFileSystem(sys.fs, sys.path) : null;
    this.cache = new Cache(config, cacheFs);

    this.cache.initCacheDir();

    this.fs = new InMemoryFileSystem(sys.fs, sys.path);
  }

  reset() {
    this.cache.clear();
    this.cachedStyleMeta.clear();
    this.collections.length = 0;
    this.compilerOptions = null;
    this.fs.clearCache();
    this.lastComponentStyleInput.clear();
    this.lazyModuleRollupCache = null;
    this.moduleMap.clear();
    this.resolvedCollections.clear();
    this.rootTsFiles.length = 0;
    this.tsService = null;
  }
}


export function getModule(compilerCtx: d.CompilerCtx, sourceFilePath: string) {
  sourceFilePath = normalizePath(sourceFilePath);

  const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
  if (moduleFile != null) {
    return moduleFile;

  } else {
    const moduleFile: d.Module = {
      sourceFilePath: sourceFilePath,
      cmps: [],
      collectionName: null,
      dtsFilePath: null,
      excludeFromCollection: false,
      externalImports: [],
      isCollectionDependency: false,
      jsFilePath: null,
      localImports: [],
      isLegacy: false,
      originalCollectionComponentPath: null
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
  moduleFile.jsFilePath = null;
  moduleFile.localImports.length = 0;
  moduleFile.originalCollectionComponentPath = null;
}
