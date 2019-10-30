import * as d from '../../declarations';
import { createTsWatchProgram } from '../transpile/create-watch-program';
import { BuildContext } from '../../compiler/build/build-ctx';
import { build } from './build';
import { filesChanged, hasHtmlChanges, hasScriptChanges, hasStyleChanges, scriptsAdded, scriptsDeleted } from '../../compiler/fs-watch/fs-watch-rebuild';
import { hasServiceWorkerChanges } from '../../compiler/service-worker/generate-sw';
import ts from 'typescript';


export const createWatchBuild = async (config: d.Config, compilerCtx: d.CompilerCtx): Promise<d.CompilerWatcher> => {
  let isRebuild = false;
  let tsWatchProgram: ts.WatchOfConfigFile<ts.BuilderProgram> = null;
  let closeResolver: Function;
  const watchWaiter = new Promise<d.WatcherCloseResults>(resolve => closeResolver = resolve);

  const filesAdded = new Set<string>();
  const filesUpdated = new Set<string>();
  const filesDeleted = new Set<string>();

  compilerCtx.events.on('fileAdd', p => {
    config.logger.debug(`fileAdd: ${p}`);
    filesAdded.add(p);
  });

  compilerCtx.events.on('fileUpdate', p => {
    config.logger.debug(`fileUpdate: ${p}`);
    filesUpdated.add(p);
  });

  compilerCtx.events.on('fileDelete', p => {
    config.logger.debug(`fileDelete: ${p}`);
    filesDeleted.add(p);
  });

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
    tsWatchProgram = await createTsWatchProgram(config, compilerCtx, onBuild);
    return watchWaiter;
  };

  const close = async () => {
    if (tsWatchProgram) {
      tsWatchProgram.close();
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
