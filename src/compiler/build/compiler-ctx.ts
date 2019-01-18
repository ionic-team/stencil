import * as d from '@declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem, normalizePath } from '@utils';


export class CompilerContext implements d.CompilerCtx {
  activeBuildId = -1;
  cache: d.Cache;
  cachedStyleMeta = new Map<string, d.StyleCompiler>();
  collections: d.CollectionCompilerMeta[] = [];
  compilerOptions: any = null;
  events = new BuildEvents();
  fs: d.InMemoryFileSystem;
  hasLoggedServerUrl = false;
  hasSuccessfulBuild = false;
  hasWatch = false;
  isActivelyBuilding = false;
  lastComponentStyleInput = new Map<string, string>();
  lastBuildHadError = false;
  lastBuildResults: d.BuildResults = null;
  lastBuildStyles = new Map<string, string>();
  lastDerivedModules: d.DerivedModule[] = null;
  localPrerenderServer: any = null;
  moduleMap: d.ModuleMap = new Map();
  resolvedCollections = new Set<string>();
  rollupCache: any = null;
  rootTsFiles: string[] = [];
  tsService: d.TsService = null;

  constructor(config: d.Config) {
    this.cache = new Cache(config, new InMemoryFileSystem(config.sys.fs, config.sys));
    this.cache.initCacheDir();

    this.fs = new InMemoryFileSystem(config.sys.fs, config.sys);
  }

  reset() {
    this.cache.clear();
    this.cachedStyleMeta.clear();
    this.collections.length = 0;
    this.compilerOptions = null;
    this.fs.clearCache();
    this.lastComponentStyleInput.clear();
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
      cmpCompilerMeta: null,
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
      jsFilePath: null,
      localImports: [],
      originalCollectionComponentPath: null,
      potentialCmpRefs: []
    };
    compilerCtx.moduleMap.set(sourceFilePath, moduleFile);
    return moduleFile;
  }
}


export function resetModule(moduleFile: d.Module) {
  moduleFile.cmpCompilerMeta = null;
  moduleFile.collectionName = null;
  moduleFile.dtsFilePath = null;
  moduleFile.excludeFromCollection = false;

  if (Array.isArray(moduleFile.externalImports)) {
    moduleFile.externalImports.length = 0;
  } else {
    moduleFile.externalImports = [];
  }

  moduleFile.hasVdomAttribute = false;
  moduleFile.hasVdomClass = false;
  moduleFile.hasVdomFunctional = false;
  moduleFile.hasVdomKey = false;
  moduleFile.hasVdomListener = false;
  moduleFile.hasVdomRef = false;
  moduleFile.hasVdomRender = false;
  moduleFile.hasVdomStyle = false;
  moduleFile.hasVdomText = false;

  if (Array.isArray(moduleFile.htmlAttrNames)) {
    moduleFile.htmlAttrNames.length = 0;
  } else {
    moduleFile.htmlAttrNames = [];
  }

  if (Array.isArray(moduleFile.htmlTagNames)) {
    moduleFile.htmlTagNames.length = 0;
  } else {
    moduleFile.htmlTagNames = [];
  }

  moduleFile.isCollectionDependency = false;
  moduleFile.jsFilePath = null;

  if (Array.isArray(moduleFile.localImports)) {
    moduleFile.localImports.length = 0;
  } else {
    moduleFile.localImports = [];
  }

  moduleFile.originalCollectionComponentPath = null;

  if (Array.isArray(moduleFile.potentialCmpRefs)) {
    moduleFile.potentialCmpRefs.length = 0;
  } else {
    moduleFile.potentialCmpRefs = [];
  }
}
