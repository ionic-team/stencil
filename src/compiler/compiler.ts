import type { Compiler, Config, Diagnostic, ValidatedConfig } from '../declarations';
import { Cache } from './cache';
import { CompilerContext } from './build/compiler-ctx';
import { createFullBuild } from './build/full-build';
import { createInMemoryFs } from './sys/in-memory-fs';
import { createSysWorker } from './sys/worker/sys-worker';
import { createWatchBuild } from './build/watch-build';
import { getConfig } from './sys/config';
import { patchFs } from './sys/fs-patch';
import { patchTypescript } from './sys/typescript/typescript-sys';
import { resolveModuleIdAsync } from './sys/resolve/resolve-module-async';
import { isFunction } from '@utils';
import ts from 'typescript';

/**
 * Generate a Stencil compiler instance
 * @param userConfig a user-provided Stencil configuration to apply to the compiler instance
 * @returns a new instance of a Stencil compiler
 * @public
 */
export const createCompiler = async (userConfig: Config): Promise<Compiler> => {
  // actual compiler code
  // could be in a web worker on the browser
  // or the main thread in node
  const config: ValidatedConfig = getConfig(userConfig);
  const diagnostics: Diagnostic[] = [];
  const sys = config.sys;
  const compilerCtx = new CompilerContext();

  if (isFunction(config.sys.setupCompiler)) {
    config.sys.setupCompiler({ ts });
  }

  patchFs(sys);

  compilerCtx.fs = createInMemoryFs(sys);
  compilerCtx.cache = new Cache(config, createInMemoryFs(sys));
  await compilerCtx.cache.initCacheDir();

  sys.resolveModuleId = (opts) => resolveModuleIdAsync(sys, compilerCtx.fs, opts);
  compilerCtx.worker = createSysWorker(config);

  if (sys.events) {
    // Pipe events from sys.events to compilerCtx
    sys.events.on(compilerCtx.events.emit);
  }
  patchTypescript(config, compilerCtx.fs);

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
