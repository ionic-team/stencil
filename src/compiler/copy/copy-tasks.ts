import * as d from '@declarations';
import { buildError } from '@utils';
import { getComponentAssetsCopyTasks } from './assets-copy-tasks';
import { getConfigCopyTasks } from './config-copy-tasks';
import { sys } from '@sys';


export async function copyTasks(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, copyTasks: d.CopyTask) {
  try {
    if (copyTasks.length > 0) {
      const timeSpan = buildCtx.createTimeSpan(`copyTasks started`, true);

      const copyResults = await sys.copy(copyTasks);

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
