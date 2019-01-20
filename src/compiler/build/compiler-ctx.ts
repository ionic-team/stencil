import * as d from '@declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem, normalizePath } from '@utils';
import { sys } from '@sys';


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
    this.cache = new Cache(config, new InMemoryFileSystem(sys.fs, sys));
    this.cache.initCacheDir();

    this.fs = new InMemoryFileSystem(sys.fs, sys);
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
      cmps: [],
      collectionName: null,
      dtsFilePath: null,
      excludeFromCollection: false,
      externalImports: [],
      isCollectionDependency: false,
      jsFilePath: null,
      localImports: [],
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
