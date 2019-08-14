import * as d from '../../declarations';
import { catchError, normalizePath } from '@utils';


export const initFsWatcher = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => {
  // only create the watcher if this is a watch build
  // and we haven't created a watch listener already
  if (!config.watch || compilerCtx.fsWatcher != null) {
    return false;
  }

  if (typeof config.sys.createFsWatcher !== 'function') {
    return false;
  }

  try {
    buildCtx.debug(`initFsWatcher: ${config.sys.path.relative(config.rootDir, config.srcDir)}`);

    // since creation is async, let's make sure multiple don't get created
    compilerCtx.fsWatcher = (true as any);

    compilerCtx.fsWatcher = await config.sys.createFsWatcher(config, config.sys.fs, compilerCtx.events);

    await compilerCtx.fsWatcher.addDirectory(config.srcDir);

    if (typeof config.configPath === 'string') {
      config.configPath = normalizePath(config.configPath);
      await compilerCtx.fsWatcher.addFile(config.configPath);
    }

  } catch (e) {
    const diagnostics: d.Diagnostic[] = [];
    catchError(diagnostics, e);
    config.logger.printDiagnostics(diagnostics);
    return false;
  }

  return true;
};
