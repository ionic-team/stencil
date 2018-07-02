import * as d from '../../declarations';
import { normalizePath } from '../util';
import { WatcherListener } from './watcher-listener';


export function initWatcher(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // only create the watcher if this is a watch build
  // and we haven't created a watch listener already
  if (compilerCtx.hasWatcher || !config.watch) {
    return false;
  }

  buildCtx.debug(`initWatcher: ${config.sys.path.relative(config.rootDir, config.srcDir)}`);

  const watcherListener = new WatcherListener(config, compilerCtx);
  watcherListener.subscribe();
  compilerCtx.hasWatcher = true;

  if (config.sys.createWatcher) {
    const watcher = config.sys.createWatcher(compilerCtx.events, config.srcDir, {
      ignored: config.watchIgnoredRegex,
      ignoreInitial: true
    });

    if (watcher && config.configPath) {
      config.configPath = normalizePath(config.configPath);
      watcher.add(config.configPath);
    }
  }

  return true;
}
