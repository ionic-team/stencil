import * as d from '@declarations';
import { FsWatchNormalizer } from './fs-watch-normalizer';
import { normalizePath } from '@utils';
import { sys } from '@sys';


export async function initFsWatch(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // only create the watcher if this is a watch build
  // and we haven't created a watch listener already
  if (compilerCtx.fsWatcher != null || !config.watch) {
    return false;
  }

  buildCtx.debug(`initFsWatch: ${sys.path.relative(config.rootDir, config.srcDir)}`);

  const fsWatchNormalizer = new FsWatchNormalizer(config, compilerCtx.events);
  fsWatchNormalizer.subscribe();
  compilerCtx.hasWatch = true;

  if (sys.createFsWatcher != null) {
    compilerCtx.fsWatcher = await sys.createFsWatcher(config, sys.fs, compilerCtx.events);

    if (compilerCtx.fsWatcher && config.configPath) {
      config.configPath = normalizePath(config.configPath);
      compilerCtx.fsWatcher.addFile(config.configPath);
    }
  }

  return true;
}
