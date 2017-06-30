import { BuildContext, BundlerConfig, CompilerConfig } from './interfaces';
import { bundleWatch } from './bundle';
import { compileWatch } from './compile';
import * as ts from 'typescript';


export function setupCompilerWatch(config: CompilerConfig, ctx: BuildContext, tsSys: ts.System) {
  if (!config.isWatch || ctx.isCompilerWatchInitialized) return;
  ctx.isCompilerWatchInitialized = true;

  const changedFiles: string[] = [];
  let timerId: NodeJS.Timer;

  function compilerFileChanged(config: CompilerConfig, ctx: BuildContext, changedFile: string) {
    if (changedFiles.indexOf(changedFile) === -1) {
      changedFiles.push(changedFile);
    }

    const wasDeleted = ctx.files.delete(changedFile);

    config.logger.debug(`${changedFile} was ${wasDeleted ? 'removed from cache' : 'not found in the cache'}`);

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      config.logger.debug(`recompile`);

      compileWatch(config, ctx, changedFiles.slice());

      changedFiles.length = 0;
    }, 200);
  }

  config.include.forEach(includePath => {
    config.logger.debug(`compile, watching directory: ${includePath}`);

    tsSys.watchDirectory(includePath === '' ? '.' : includePath, (changedFile: string) => {
      compilerFileChanged(config, ctx, changedFile);
    }, true);
  });

  ctx.files.forEach(f => {
    if (f.recompileOnChange && !f.isWatching) {
      tsSys.watchFile(f.filePath, (changedFile) => {
        compilerFileChanged(config, ctx, changedFile);
      });
    }
  });
}


export function setupBundlerWatch(config: BundlerConfig, ctx: BuildContext, tsSys: ts.System) {
  if (!config.isWatch || ctx.isBundlerWatchInitialized) return;

  ctx.isBundlerWatchInitialized = true;

  config.logger.debug(`bundle, watching directory: ${config.srcDir}`);

  const changedFiles: string[] = [];
  let timerId: any;

  function bundlerFileChanged(config: BundlerConfig, ctx: BuildContext, changedFile: string) {
    if (changedFiles.indexOf(changedFile) === -1) {
      changedFiles.push(changedFile);
    }

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      config.logger.debug(`rebundle`);

      bundleWatch(config, ctx, changedFiles.slice());

      changedFiles.length = 0;
    }, 200);
  }

  tsSys.watchDirectory(config.srcDir === '' ? '.' : config.srcDir, (changedFile) => {
    bundlerFileChanged(config, ctx, changedFile);
  }, true);

  ctx.files.forEach(f => {
    if (f.rebundleOnChange && !f.isWatching) {
      tsSys.watchFile(f.filePath, (changedFile) => {
        bundlerFileChanged(config, ctx, changedFile);
      });
    }
  });
}
