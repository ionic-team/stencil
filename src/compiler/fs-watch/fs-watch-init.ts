import * as d from '../../declarations';
import { normalizePath } from '../util';


export async function initFsWatch(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // only create the watcher if this is a watch build
  // and we haven't created a watch listener already
  if (compilerCtx.fsWatcher || !config.watch) {
    return false;
  }

  buildCtx.debug(`initFsWatch: ${config.sys.path.relative(config.rootDir, config.srcDir)}`);

  if (config.sys.createFsWatcher) {
    compilerCtx.fsWatcher = await config.sys.createFsWatcher(config.sys.fs, config.logger, compilerCtx.events, config.rootDir, config.srcDir);

    if (compilerCtx.fsWatcher && config.configPath) {
      config.configPath = normalizePath(config.configPath);
      compilerCtx.fsWatcher.addFile(config.configPath);
    }
  }

  return true;
}
