import { Cache } from './cache';
import { Compiler, Config, Diagnostic } from '../declarations';
import { CompilerContext } from './build/compiler-ctx';
import { createFullBuild } from './build/full-build';
import { createInMemoryFs } from './sys/in-memory-fs';
import { createSysWorker } from './sys/worker/sys-worker';
import { createWatchBuild } from './build/watch-build';
import { dependencies } from './sys/dependencies';
import { getConfig } from './sys/config';
import { patchFs } from './sys/fs-patch';
import { patchTypescript } from './sys/typescript/typescript-patch';
import { resolveModuleIdAsync } from './sys/resolve/resolve-module-async';
import { isFunction } from '@utils';

export const createCompiler = async (config: Config) => {
  // actual compiler code
  // could be in a web worker on the browser
  // or the main thread in node
  config = getConfig(config);
  const diagnostics: Diagnostic[] = [];
  const sys = config.sys;
  const compilerCtx = new CompilerContext();

  patchFs(sys);

  if (isFunction(sys.ensureDependencies)) {
    await sys.ensureDependencies({ rootDir: config.rootDir, dependencies });
  }

  compilerCtx.fs = createInMemoryFs(sys);
  compilerCtx.cache = new Cache(config, createInMemoryFs(sys));
  await compilerCtx.cache.initCacheDir();

  sys.resolveModuleId = opts => resolveModuleIdAsync(sys, compilerCtx.fs, opts);
  compilerCtx.worker = createSysWorker(config);

  if (sys.events) {
    // Pipe events from sys.events to compilerCtx
    sys.events.on(compilerCtx.events.emit);
  }
  await patchTypescript(config, diagnostics, compilerCtx.fs);

  const build = () => createFullBuild(config, compilerCtx);

  const createWatcher = () => createWatchBuild(config, compilerCtx);

  const destroy = async () => {
    compilerCtx.reset();
    compilerCtx.events.unsubscribeAll();
    await sys.destroy();
  };

  const compiler: Compiler = {
    build,
    createWatcher,
    destroy,
    sys,
  };

  config.logger.printDiagnostics(diagnostics);

  return compiler;
};
