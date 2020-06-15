import * as d from '../../declarations';
import { basename, dirname, extname, join } from 'path';
import { buildEvents } from '../events';
import { normalizePath } from '@utils';

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
  lastBuildResults: d.CompilerBuildResults = null;
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
