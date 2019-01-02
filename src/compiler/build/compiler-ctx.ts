import * as d from '../../declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem } from '../../util/in-memory-fs';
import { normalizePath } from '../util';


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
    const module = new ModuleFile(sourceFilePath);
    compilerCtx.moduleMap.set(sourceFilePath, module);
    return module;
  }
}


export class ModuleFile implements d.Module {
  cmpCompilerMeta: d.ComponentCompilerMeta = null;
  collectionName: string = null;
  dtsFilePath: string = null;
  excludeFromCollection = false;
  externalImports: string[] = [];
  hasVdomAttribute = false;
  hasVdomClass = false;
  hasVdomFunctional = false;
  hasVdomKey = false;
  hasVdomListener = false;
  hasVdomRef = false;
  hasVdomRender = false;
  hasVdomStyle = false;
  hasVdomText = false;
  htmlAttrNames: string[] = [];
  htmlTagNames: string[] = [];
  isCollectionDependency = false;
  jsFilePath: string = null;
  localImports: string[] = [];
  originalCollectionComponentPath: string = null;
  potentialCmpRefs: d.PotentialComponentRef[] = [];
  sourceFilePath: string;

  constructor(sourceFilePath: string) {
    this.sourceFilePath = sourceFilePath;
  }

  reset() {
    this.cmpCompilerMeta = null;
    this.collectionName = null;
    this.dtsFilePath = null;
    this.excludeFromCollection = false;
    this.externalImports.length = 0;
    this.hasVdomAttribute = false;
    this.hasVdomClass = false;
    this.hasVdomFunctional = false;
    this.hasVdomKey = false;
    this.hasVdomListener = false;
    this.hasVdomRef = false;
    this.hasVdomRender = false;
    this.hasVdomStyle = false;
    this.hasVdomText = false;
    this.htmlAttrNames.length = 0;
    this.htmlTagNames.length = 0;
    this.isCollectionDependency = false;
    this.jsFilePath = null;
    this.localImports.length = 0;
    this.originalCollectionComponentPath = null;
    this.potentialCmpRefs.length = 0;
  }
}
