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
  compilerCtx.rollupCache = compilerCtx.rollupCache || {};
  compilerCtx.collections = compilerCtx.collections || {};
  compilerCtx.compiledModuleJsText = compilerCtx.compiledModuleJsText || {};
  compilerCtx.compiledModuleLegacyJsText = compilerCtx.compiledModuleLegacyJsText || {};

  if (typeof compilerCtx.activeBuildId !== 'number') {
    compilerCtx.activeBuildId = -1;
  }

  return compilerCtx;
}
