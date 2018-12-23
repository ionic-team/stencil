import * as d from '../../declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem } from '../../util/in-memory-fs';
import { normalizePath } from '../util';


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

export function getModuleFile(compilerCtx: d.CompilerCtx, sourceFilePath: string) {
  /** OLD WAY */
  sourceFilePath = normalizePath(sourceFilePath);
  return compilerCtx.moduleFiles[sourceFilePath] = compilerCtx.moduleFiles[sourceFilePath] || {
    sourceFilePath: sourceFilePath,
    cmpMeta: null,
    localImports: [],
    externalImports: [],
    potentialCmpRefs: [],
    isCollectionDependency: false,
    collectionName: null
  } as d.ModuleFile;
}


export function getCompilerCtx(config: d.Config, compilerCtx?: d.CompilerCtx) {
  // reusable data between builds
  compilerCtx = compilerCtx || {};
  compilerCtx.isActivelyBuilding = false;
  compilerCtx.fs = compilerCtx.fs || new InMemoryFileSystem(config.sys.fs, config.sys);

  if (!compilerCtx.cache) {
    compilerCtx.cache = new Cache(config, new InMemoryFileSystem(config.sys.fs, config.sys));
    compilerCtx.cache.initCacheDir();
  }

  compilerCtx.events = compilerCtx.events || new BuildEvents();
  compilerCtx.appFiles = compilerCtx.appFiles || {};
  compilerCtx.moduleFiles = compilerCtx.moduleFiles || {};
  compilerCtx.moduleMap = compilerCtx.moduleMap || new Map();
  compilerCtx.collections = compilerCtx.collections || [];
  compilerCtx.resolvedCollections = compilerCtx.resolvedCollections || new Set();
  compilerCtx.compiledModuleJsText = compilerCtx.compiledModuleJsText || {};
  compilerCtx.compiledModuleLegacyJsText = compilerCtx.compiledModuleLegacyJsText || {};

  compilerCtx.lastBuildStyles = compilerCtx.lastBuildStyles || new Map();
  compilerCtx.cachedStyleMeta = compilerCtx.cachedStyleMeta || new Map();
  compilerCtx.lastComponentStyleInput = compilerCtx.lastComponentStyleInput || new Map();

  if (typeof compilerCtx.activeBuildId !== 'number') {
    compilerCtx.activeBuildId = -1;
  }

  return compilerCtx;
}


export function resetCompilerCtx(compilerCtx: d.CompilerCtx) {
  compilerCtx.fs.clearCache();
  compilerCtx.cache.clear();
  compilerCtx.appFiles = {};
  compilerCtx.moduleFiles = {};
  compilerCtx.moduleMap.clear();
  compilerCtx.collections.length = 0;
  compilerCtx.resolvedCollections.clear();
  compilerCtx.compiledModuleJsText = {};
  compilerCtx.compiledModuleLegacyJsText = {};
  compilerCtx.compilerOptions = null;
  compilerCtx.cachedStyleMeta.clear();
  compilerCtx.lastComponentStyleInput.clear();
  compilerCtx.tsService = null;
  compilerCtx.rootTsFiles = null;

  // do NOT reset 'hasSuccessfulBuild'
}
