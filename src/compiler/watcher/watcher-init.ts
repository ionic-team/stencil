import { BuildCtx, CompilerCtx, Config } from '../../declarations';
import { normalizePath } from '../util';
import { WatcherListener } from './watcher-listener';


export function initWatcher(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx) {
  // only create the watcher if this is a watch build
  // and this is the first build
  if (compilerCtx.hasSuccessfulBuild || !config.watch) return;

  config.logger.debug(`initWatcher: ${config.srcDir}`);

  const watcherListener = new WatcherListener(config, compilerCtx, buildCtx);
  watcherListener.subscribe();

  if (config.sys.createWatcher) {
    const watcher = config.sys.createWatcher(compilerCtx.events, config.srcDir, {
      ignored: config.watchIgnoredRegex,
      ignoreInitial: true
    });

    if (watcher && config.configPath) {
      config.configPath = normalizePath(config.configPath);
      config.logger.debug(`watch configPath: ${config.configPath}`);
      watcher.add(config.configPath);
    }
  }
}
