import * as d from '../../declarations';
import { isOutputTargetCopy } from './output-utils';
import { buildError, normalizePath } from '@utils';
import { canSkipAssetsCopy, getComponentAssetsCopyTasks } from '../copy/assets-copy-tasks';
import { getDestAbsPath, getSrcAbsPath } from '../copy/local-copy-tasks';
import isGlob from 'is-glob';
import minimatch from 'minimatch';

export async function outputCopy(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) {
  const outputTargets = config.outputTargets.filter(isOutputTargetCopy);
  if (outputTargets.length === 0) {
    return;
  }

  const changedFiles = [
    ...buildCtx.filesUpdated,
    ...buildCtx.filesAdded,
    ...buildCtx.dirsAdded
  ];
  const copyTasks: Required<d.CopyTask>[] = [];
  const needsCopyAssets = !canSkipAssetsCopy(config, compilerCtx, buildCtx.entryModules, buildCtx.filesChanged);
  outputTargets.forEach(o => {
    if (needsCopyAssets && o.copyAssets) {
      copyTasks.push(
        ...getComponentAssetsCopyTasks(config, buildCtx, o.dir, o.copyAssets === 'collection')
      );
    }
    copyTasks.push(
      ...getCopyTasks(config, buildCtx, o, changedFiles)
    );
  });


  if (copyTasks.length > 0) {
    const timespan = buildCtx.createTimeSpan(`copy started`);
    let copiedFiles = 0;
    try {

      const copyResults = await config.sys.copy(copyTasks, config.srcDir);
      if (copyResults != null) {
        buildCtx.diagnostics.push(...copyResults.diagnostics);
        compilerCtx.fs.cancelDeleteDirectoriesFromDisk(copyResults.dirPaths);
        compilerCtx.fs.cancelDeleteFilesFromDisk(copyResults.filePaths);
        copiedFiles = copyResults.filePaths.length;
      }

    } catch (e) {
      const err = buildError(buildCtx.diagnostics);
      err.messageText = e.message;
    }
    timespan.finish(`copy finished (${copiedFiles} file${copiedFiles === 1 ? '' : 's'})`);
  }
}

function getCopyTasks(config: d.Config, buildCtx: d.BuildCtx, o: d.OutputTargetCopy, changedFiles: string[]) {
  if (!Array.isArray(o.copy)) {
    return [];
  }
  const copyTasks = (!buildCtx.isRebuild || buildCtx.requiresFullBuild)
    ? o.copy
    : filterCopyTasks(config, o.copy, changedFiles);

  return copyTasks.map(t => transformToAbs(config, t, o.dir));
}


function filterCopyTasks(config: d.Config, tasks: d.CopyTask[], changedFiles: string[]) {
  if (Array.isArray(tasks)) {
    return tasks.filter(copy => {
      let copySrc = copy.src;
      if (isGlob(copySrc)) {
        // test the glob
        copySrc = config.sys.path.join(config.srcDir, copySrc);
        if (changedFiles.some(minimatch.filter(copySrc))) {
          return true;
        }
      } else {
        copySrc = normalizePath(getSrcAbsPath(config, copySrc + '/'));
        if (changedFiles.some(f => f.startsWith(copySrc))) {
          return true;
        }
      }
      return false;
    });
  }
  return [];
}

function transformToAbs(config: d.Config, copyTask: d.CopyTask, dest: string): Required<d.CopyTask> {
  return {
    src: copyTask.src,
    dest: getDestAbsPath(config, copyTask.src, dest, copyTask.dest),
    keepDirStructure: typeof copyTask.keepDirStructure === 'boolean' ? copyTask.keepDirStructure : copyTask.dest == null,
    warn: copyTask.warn !== false
  };
}
