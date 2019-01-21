import * as d from '@declarations';
import { catchError, normalizePath } from '@utils';
import { FsWatchNormalizer } from './fs-watch-normalizer';
import { sys } from '@sys';


export async function initFsWatcher(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  // only create the watcher if this is a watch build
  // and we haven't created a watch listener already
  if (!config.watch || compilerCtx.fsWatcher != null) {
    return false;
  }

  if (sys.createFsWatcher == null) {
    // mocking and some testing systems probably won't have this
    return false;
  }

  try {
    buildCtx.debug(`initFsWatcher: ${sys.path.relative(config.rootDir, config.srcDir)}`);

    compilerCtx.fsWatcher = await sys.createFsWatcher(sys.fs, compilerCtx.events, config.rootDir);

    await compilerCtx.fsWatcher.addDirectory(config.srcDir);

    if (typeof config.configPath === 'string') {
      config.configPath = normalizePath(config.configPath);
      await compilerCtx.fsWatcher.addFile(config.configPath);
    }

    const fsWatchNormalizer = new FsWatchNormalizer(config, compilerCtx.events);
    fsWatchNormalizer.subscribe();

  } catch (e) {
    catchError(buildCtx.diagnostics, e);
    return false;
  }

  return true;
}
