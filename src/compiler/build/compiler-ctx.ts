import * as d from '../../declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem } from '../../util/in-memory-fs';
import { normalizePath } from '../util';


export class CompilerContext implements d.CompilerCtx {
  activeBuildId = -1;
  cache: d.Cache;
  cachedStyleMeta = new Map<string, d.StyleMeta>();
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
  lastRawModules: d.DerivedModule[] = null;
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

  const module = compilerCtx.moduleMap.get(sourceFilePath);
  if (module) {
    return module;

  } else {
    const module: d.Module = {
      cmpCompilerMeta: null,
      collectionName: null,
      externalImports: [],
      isCollectionDependency: false,
      localImports: [],
      potentialCmpRefs: [],
      sourceFilePath: sourceFilePath
    };
    compilerCtx.moduleMap.set(sourceFilePath, module);
    return module;
  }
}
