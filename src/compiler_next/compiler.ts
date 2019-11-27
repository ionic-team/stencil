import { Cache } from '../compiler/cache';
import { CompilerNext, Config, Diagnostic } from '../declarations';
import { CompilerContext } from './build/compiler-ctx';
import { createFullBuild } from './build/full-build';
import { createSysWorker } from './sys/worker/sys-worker';
import { createWatchBuild } from './build/watch-build';
import { getConfig, patchSysLegacy } from './sys/config';
import { inMemoryFs } from './sys/in-memory-fs';
import { patchFs } from './sys/fs-patch';
import { patchTypescript } from './sys/typescript/typescript-patch';


export const createCompiler = async (config: Config) => {
  // actual compiler code
  // could be in a web worker on the browser
  // or the main thread in node
  config = getConfig(config);
  const diagnostics: Diagnostic[] = [];
  const sys = config.sys_next;
  const compilerCtx = new CompilerContext();

  patchFs(sys);

  compilerCtx.fs = inMemoryFs(sys);
  compilerCtx.cache = new Cache(config, inMemoryFs(sys));
  await compilerCtx.cache.initCacheDir();

  compilerCtx.worker = createSysWorker(sys, compilerCtx.events, config.maxConcurrentWorkers);
  patchSysLegacy(config, compilerCtx);

  if (sys.events) {
    // Pipe events from sys.events to compilerCtx
    sys.events.on(compilerCtx.events.emit);
  }
  await patchTypescript(config, diagnostics, compilerCtx.fs);

  const build = () => createFullBuild(config, compilerCtx);

  const createWatcher = () =>
    createWatchBuild(config, compilerCtx);

  const destroy = async () => {
    compilerCtx.reset();
    compilerCtx.events.unsubscribeAll();
    await sys.destroy();
  };

  const compiler: CompilerNext = {
    build,
    createWatcher,
    destroy,
    sys
  };

  config.logger.printDiagnostics(diagnostics);

  return compiler;
};
