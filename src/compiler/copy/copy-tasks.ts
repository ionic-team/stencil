import * as d from '../../declarations';
import { buildError } from '@utils';


export async function performCopyTasks(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, copyTasks: d.CopyTask[]) {
  try {
    if (copyTasks.length > 0) {
      const timeSpan = buildCtx.createTimeSpan(`copyTasks started`, true);
      const promise = config.sys.copy(copyTasks);
      buildCtx.pendingCopyTasks.push(promise);

      const copyResults = await promise;
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

export async function waitForCopyTasks(buildCtx: d.BuildCtx) {
  await Promise.all(
    buildCtx.pendingCopyTasks
  );
  buildCtx.pendingCopyTasks.length = 0;
}
