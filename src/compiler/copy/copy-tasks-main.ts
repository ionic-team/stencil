import * as d from '../../declarations';
import { buildError } from '../util';
import { getComponentAssetsCopyTasks } from './assets-copy-tasks';
import { getConfigCopyTasks } from './config-copy-tasks';


export async function copyTasksMain(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  try {
    const cmpAssetsCopyTasks = getComponentAssetsCopyTasks(config, compilerCtx, entryModules, buildCtx.filesChanged);
    const configCopyTasks = await getConfigCopyTasks(config, buildCtx);

    const copyTasks = [
      ...configCopyTasks,
      ...cmpAssetsCopyTasks
    ];

    if (copyTasks.length > 0) {
      const timeSpan = buildCtx.createTimeSpan(`copyTasks started`, true);

      const copyResults = await config.sys.copy(copyTasks);

      buildCtx.diagnostics.push(...copyResults.diagnostics);

      compilerCtx.fs.cancelDeleteDirectoriesFromDisk(copyResults.dirPaths);
      compilerCtx.fs.cancelDeleteFilesFromDisk(copyResults.filePaths);

      timeSpan.finish(`copyTasks finished`);
    }

  } catch (e) {
    const err = buildError(buildCtx.diagnostics);
    err.messageText = e.message;
  }
}
