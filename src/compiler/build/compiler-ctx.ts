import { BuildEvents } from '../events';
import { Cache } from '../cache';
import { CompilerCtx, Config } from '../../declarations';
import { InMemoryFileSystem } from '../../util/in-memory-fs';


export function getCompilerCtx(config: Config, compilerCtx?: CompilerCtx) {
  // reusable data between builds
  compilerCtx = compilerCtx || {};
  compilerCtx.fs = compilerCtx.fs || new InMemoryFileSystem(config.sys.fs, config.sys.path);
  compilerCtx.cache = compilerCtx.cache || new Cache(config, new InMemoryFileSystem(config.sys.fs, config.sys.path), config.sys.tmpdir());
  compilerCtx.events = compilerCtx.events || new BuildEvents(config);
  compilerCtx.appFiles = compilerCtx.appFiles || {};
  compilerCtx.moduleFiles = compilerCtx.moduleFiles || {};
  compilerCtx.collections = compilerCtx.collections || [];
  compilerCtx.resolvedModuleIds = compilerCtx.resolvedModuleIds || [];
  compilerCtx.compiledModuleJsText = compilerCtx.compiledModuleJsText || {};
  compilerCtx.compiledModuleLegacyJsText = compilerCtx.compiledModuleLegacyJsText || {};

  if (typeof compilerCtx.activeBuildId !== 'number') {
    compilerCtx.activeBuildId = -1;
  }

  return compilerCtx;
}


export function resetCompilerCtx(compilerCtx: CompilerCtx) {
  compilerCtx.fs.clearCache();
  compilerCtx.cache.clear();
  compilerCtx.appFiles = {};
  compilerCtx.moduleFiles = {};
  compilerCtx.collections.length = 0;
  compilerCtx.resolvedModuleIds.length = 0;
  compilerCtx.compiledModuleJsText = {};
  compilerCtx.compiledModuleLegacyJsText = {};

  // do NOT reset 'hasSuccessfulBuild'
}
