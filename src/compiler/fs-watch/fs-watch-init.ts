import * as d from '../../declarations';
import { FsWatchNormalizer } from './fs-watch-normalizer';
import { normalizePath } from '../util';


export function initFsWatch(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // only create the watcher if this is a watch build
  // and we haven't created a watch listener already
  if (compilerCtx.hasWatch || !config.watch) {
    return false;
  }

  buildCtx.debug(`initFsWatch: ${config.sys.path.relative(config.rootDir, config.srcDir)}`);

  const fsWatchNormalizer = new FsWatchNormalizer(config, compilerCtx.events);
  fsWatchNormalizer.subscribe();
  compilerCtx.hasWatch = true;

  if (config.sys.createFsWatcher) {
    const fsWatcher = config.sys.createFsWatcher(config.sys.fs, compilerCtx.events, config.srcDir, {
      ignored: config.watchIgnoredRegex,
      ignoreInitial: true
    });

    if (fsWatcher && config.configPath) {
      config.configPath = normalizePath(config.configPath);
      fsWatcher.add(config.configPath);
    }
  }

  return true;
}
