import * as d from '../../declarations';
import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { InMemoryFileSystem } from '../../util/in-memory-fs';
import { normalizePath } from '../util';


export function getModuleFile(compilerCtx: d.CompilerCtx, sourceFilePath: string) {
  sourceFilePath = normalizePath(sourceFilePath);
  return compilerCtx.moduleFiles[sourceFilePath] = compilerCtx.moduleFiles[sourceFilePath] || {
    sourceFilePath: sourceFilePath,
    localImports: [],
    externalImports: [],
    potentialCmpRefs: []
  };
}


export function getCompilerCtx(config: d.Config, compilerCtx?: d.CompilerCtx) {
  // reusable data between builds
  compilerCtx = compilerCtx || {};
  compilerCtx.fs = compilerCtx.fs || new InMemoryFileSystem(config.sys.fs, config.sys);

  if (!compilerCtx.cache) {
    compilerCtx.cache = new Cache(config, new InMemoryFileSystem(config.sys.fs, config.sys));
    compilerCtx.cache.initCacheDir();
  }

  compilerCtx.events = compilerCtx.events || new BuildEvents();
  compilerCtx.appFiles = compilerCtx.appFiles || {};
  compilerCtx.moduleFiles = compilerCtx.moduleFiles || {};
  compilerCtx.collections = compilerCtx.collections || [];
  compilerCtx.resolvedCollections = compilerCtx.resolvedCollections || [];
  compilerCtx.compiledModuleJsText = compilerCtx.compiledModuleJsText || {};
  compilerCtx.compiledModuleLegacyJsText = compilerCtx.compiledModuleLegacyJsText || {};
  compilerCtx.lastStyleText = compilerCtx.lastStyleText || {};

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
  compilerCtx.collections.length = 0;
  compilerCtx.resolvedCollections.length = 0;
  compilerCtx.compiledModuleJsText = {};
  compilerCtx.compiledModuleLegacyJsText = {};
  compilerCtx.compilerOptions = null;
  compilerCtx.lastStyleText = {};
  compilerCtx.tsService = null;
  compilerCtx.rootTsFiles = null;

  // do NOT reset 'hasSuccessfulBuild'
}
