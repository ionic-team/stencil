import * as d from '../../declarations';
import { createTsWatchProgram } from '../transpile/create-watch-program';
import { BuildContext } from '../../compiler/build/build-ctx';
import { build } from './build';
import { filesChanged, hasHtmlChanges, hasScriptChanges, hasStyleChanges, scriptsAdded, scriptsDeleted } from '../../compiler/fs-watch/fs-watch-rebuild';
import { hasServiceWorkerChanges } from '../../compiler/service-worker/generate-sw';
import ts from 'typescript';


export const createWatchBuild = async (config: d.Config, compilerCtx: d.CompilerCtx): Promise<d.CompilerWatcher> => {
  let isRebuild = false;
  let tsWatchProgram: any;
  let fileWatcher: any;

  let closeResolver: Function;
  const watchWaiter = new Promise<d.WatcherCloseResults>(resolve => closeResolver = resolve);

  const filesAdded = new Set<string>();
  const filesUpdated = new Set<string>();
  const filesDeleted = new Set<string>();

  const onFileChange: d.CompilerFileWatcherCallback = (file, kind) => {
    compilerCtx.fs.clearFileCache(file);
    compilerCtx.changedFiles.add(file);
    switch (kind) {
      case 'fileAdd': filesAdded.add(file); break;
      case 'fileUpdate': filesUpdated.add(file); break;
      case 'fileDelete': filesDeleted.add(file); break;
    }
    config.logger.debug(`${kind}: ${file}`);
    tsWatchProgram.rebuild();
  };

  const onBuild = async (tsBuilder: ts.BuilderProgram) => {
    const buildCtx = new BuildContext(config, compilerCtx);
    buildCtx.filesAdded = Array.from(filesAdded.keys()).sort();
    buildCtx.filesUpdated = Array.from(filesUpdated.keys()).sort();
    buildCtx.filesDeleted = Array.from(filesDeleted.keys()).sort();
    buildCtx.filesChanged = filesChanged(buildCtx);
    buildCtx.scriptsAdded = scriptsAdded(config, buildCtx);
    buildCtx.scriptsDeleted = scriptsDeleted(config, buildCtx);
    buildCtx.hasScriptChanges = hasScriptChanges(buildCtx);
    buildCtx.hasStyleChanges = hasStyleChanges(buildCtx);
    buildCtx.hasHtmlChanges = hasHtmlChanges(config, buildCtx);
    buildCtx.hasServiceWorkerChanges = hasServiceWorkerChanges(config, buildCtx);

    filesAdded.clear();
    filesUpdated.clear();
    filesDeleted.clear();

    buildCtx.isRebuild = isRebuild;
    buildCtx.requiresFullBuild = !isRebuild;
    buildCtx.start();

    await build(config, compilerCtx, buildCtx, tsBuilder);

    isRebuild = true;
  };

  const start = async () => {
    fileWatcher = await watchSrcDirectory(config, compilerCtx, onFileChange);
    tsWatchProgram = await createTsWatchProgram(config, onBuild);
    return watchWaiter;
  };

  const close = async () => {
    if (tsWatchProgram) {
      fileWatcher.close();
      tsWatchProgram.program.close();
      tsWatchProgram = null;
    }
    const watcherCloseResults: d.WatcherCloseResults = {
      exitCode: 0
    };
    closeResolver(watcherCloseResults);
    return watcherCloseResults;
  };

  config.sys_next.addDestory(close);

  return {
    start,
    close,
    on: compilerCtx.events.on
  };
};

export const watchSrcDirectory = async (config: d.Config, compilerCtx: d.CompilerCtx, callback: d.CompilerFileWatcherCallback) => {
  const watching = new Map();
  const watchFile = (path: string) => {
    if (!watching.has(path)) {
      watching.set(path, config.sys_next.watchFile(path, callback));
    }
  };
  const files = await compilerCtx.fs.readdir(config.srcDir, {
    recursive: true
  });

  files
    .filter(({isFile}) => isFile)
    .forEach(({absPath}) => watchFile(absPath));

  watching.set(
    config.srcDir,
    config.sys_next.watchDirectory(config.srcDir, (filename, kind) => {
      watchFile(filename);
      callback(filename, kind);
    })
  );

  return {
    close() {
      watching.forEach(w => w.close());
    }
  };
};
