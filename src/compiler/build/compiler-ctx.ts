import type * as d from '../../declarations';
import { basename, dirname, extname, join } from 'path';
import { buildEvents } from '../events';
import { noop, normalizePath } from '@utils';

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
  addWatchDir: (path: string) => void = noop;
  addWatchFile: (path: string) => void = noop;
  cache: d.Cache;
  cssModuleImports = new Map<string, string[]>();
  changedFiles = new Set<string>();
  changedModules = new Set<string>();
  collections: d.CollectionCompilerMeta[] = [];
  compilerOptions: any = null;
  events = buildEvents();
  fs: d.InMemoryFileSystem;
  hasSuccessfulBuild = false;
  isActivelyBuilding = false;
  lastBuildResults: d.CompilerBuildResults = null;
  moduleMap: d.ModuleMap = new Map();
  nodeMap = new WeakMap();
  resolvedCollections = new Set<string>();
  rollupCache = new Map();
  rollupCacheHydrate: any = null;
  rollupCacheLazy: any = null;
  rollupCacheNative: any = null;
  cachedGlobalStyle: string;
  styleModeNames = new Set<string>();
  worker: d.CompilerWorkerContext = null;

  reset() {
    this.cache.clear();
    this.cssModuleImports.clear();
    this.cachedGlobalStyle = null;
    this.collections.length = 0;
    this.compilerOptions = null;
    this.hasSuccessfulBuild = false;
    this.rollupCacheHydrate = null;
    this.rollupCacheLazy = null;
    this.rollupCacheNative = null;
    this.moduleMap.clear();
    this.resolvedCollections.clear();

    if (this.fs != null) {
      this.fs.clearCache();
    }
  }
}

export const getModuleLegacy = (_config: d.Config, compilerCtx: d.CompilerCtx, sourceFilePath: string) => {
  sourceFilePath = normalizePath(sourceFilePath);

  const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
  if (moduleFile != null) {
    return moduleFile;
  } else {
    const sourceFileDir = dirname(sourceFilePath);
    const sourceFileExt = extname(sourceFilePath);
    const sourceFileName = basename(sourceFilePath, sourceFileExt);
    const jsFilePath = join(sourceFileDir, sourceFileName + '.js');

    const moduleFile: d.Module = {
      sourceFilePath: sourceFilePath,
      jsFilePath: jsFilePath,
      cmps: [],
      coreRuntimeApis: [],
      collectionName: null,
      dtsFilePath: null,
      excludeFromCollection: false,
      externalImports: [],
      hasVdomAttribute: false,
      hasVdomXlink: false,
      hasVdomClass: false,
      hasVdomFunctional: false,
      hasVdomKey: false,
      hasVdomListener: false,
      hasVdomPropOrAttr: false,
      hasVdomRef: false,
      hasVdomRender: false,
      hasVdomStyle: false,
      hasVdomText: false,
      htmlAttrNames: [],
      htmlTagNames: [],
      htmlParts: [],
      isCollectionDependency: false,
      isLegacy: false,
      localImports: [],
      originalCollectionComponentPath: null,
      originalImports: [],
      potentialCmpRefs: [],
      staticSourceFile: null,
      staticSourceFileText: '',
      sourceMapPath: null,
      sourceMapFileText: null,
    };
    compilerCtx.moduleMap.set(sourceFilePath, moduleFile);
    return moduleFile;
  }
};

export const resetModuleLegacy = (moduleFile: d.Module) => {
  moduleFile.cmps.length = 0;
  moduleFile.coreRuntimeApis.length = 0;
  moduleFile.collectionName = null;
  moduleFile.dtsFilePath = null;
  moduleFile.excludeFromCollection = false;
  moduleFile.externalImports.length = 0;
  moduleFile.isCollectionDependency = false;
  moduleFile.localImports.length = 0;
  moduleFile.originalCollectionComponentPath = null;
  moduleFile.originalImports.length = 0;

  moduleFile.hasVdomXlink = false;
  moduleFile.hasVdomAttribute = false;
  moduleFile.hasVdomClass = false;
  moduleFile.hasVdomFunctional = false;
  moduleFile.hasVdomKey = false;
  moduleFile.hasVdomListener = false;
  moduleFile.hasVdomRef = false;
  moduleFile.hasVdomRender = false;
  moduleFile.hasVdomStyle = false;
  moduleFile.hasVdomText = false;
  moduleFile.htmlAttrNames.length = 0;
  moduleFile.htmlTagNames.length = 0;
  moduleFile.potentialCmpRefs.length = 0;
};
