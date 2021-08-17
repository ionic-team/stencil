import type { Compiler, Config, Diagnostic } from '../declarations';
import { Cache } from './cache';
import { createFullBuild } from './build/full-build';
import { CompilerContext } from './build/compiler-ctx';
import { createInMemoryFs } from './sys/in-memory-fs';
import { createSysWorker } from './sys/worker/sys-worker';
import { createWatchBuild } from './build/watch-build';
import { getConfig } from './sys/config';
import { patchFs } from './sys/fs-patch';
import { patchTypescript } from './sys/typescript/typescript-sys';
import { resolveModuleIdAsync } from './sys/resolve/resolve-module-async';
import { isFunction, initializeStencilCompilerContext, getStencilCompilerContext } from '@utils';
import ts from 'typescript';

export const createCompiler = async (config: Config) => {
  // actual compiler code
  // could be in a web worker on the browser
  // or the main thread in node
  config = getConfig(config);
  const diagnostics: Diagnostic[] = [];
  const sys = config.sys;
  initializeStencilCompilerContext({ compilerCtx: new CompilerContext() });

  if (isFunction(config.sys.setupCompiler)) {
    config.sys.setupCompiler({ ts });
  }

  patchFs(sys);

  getStencilCompilerContext().fs = createInMemoryFs(sys);
  getStencilCompilerContext().cache = new Cache(config, createInMemoryFs(sys));
  await getStencilCompilerContext().cache.initCacheDir();

  sys.resolveModuleId = (opts) => resolveModuleIdAsync(sys, getStencilCompilerContext().fs, opts);
  getStencilCompilerContext().worker = createSysWorker(config);

  if (sys.events) {
    // Pipe events from sys.events to compilerCtx
    sys.events.on(getStencilCompilerContext().events.emit);
  }
  patchTypescript(config, getStencilCompilerContext().fs);

  const build = () => createFullBuild(config);

  const createWatcher = () => createWatchBuild(config);

  const destroy = async () => {
    getStencilCompilerContext().reset();
    getStencilCompilerContext().events.unsubscribeAll();
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
