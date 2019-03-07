import * as d from '@declarations';
import { buildError, normalizePath } from '@utils';
import isGlob from 'is-glob';
import minimatch from 'minimatch';
import { sys } from '@sys';
import { isOutputTargetDistCollection, isOutputTargetWww } from '../output-targets/output-utils';


export async function getConfigCopyTasks(config: d.Config, buildCtx: d.BuildCtx) {
  const copyTasks: d.CopyTask[] = [];

  if (!Array.isArray(config.copy)) {
    return copyTasks;
  }

  if (buildCtx.isRebuild && !buildCtx.hasCopyChanges) {
    // don't bother copying if this was from a watch change
    // but the change didn't include any copy task files
    return copyTasks;
  }

  try {
    await Promise.all(config.copy.map(async copyTask => {
      await processCopyTasks(config, copyTasks, copyTask);
    }));

  } catch (e) {
    const err = buildError(buildCtx.diagnostics);
    err.messageText = e.message;
  }

  buildCtx.debug(`getConfigCopyTasks: ${copyTasks.length}`);

  return copyTasks;
}


export async function processCopyTasks(config: d.Config, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask): Promise<any> {
  if (!copyTask) {
    // possible null was set, which is fine, just skip over this one
    return;
  }

  if (!copyTask.src) {
    throw new Error(`copy missing "src" property`);
  }

  if (copyTask.dest && isGlob(copyTask.dest)) {
    throw new Error(`copy "dest" property cannot be a glob: ${copyTask.dest}`);
  }

  const destinations = config.outputTargets.map(o => {
    if (isOutputTargetDistCollection(o)) {
      return o.collectionDir;
    }
    if (isOutputTargetWww(o)) {
      return o.dir;
    }
    return undefined;
  }).filter(dst => !!dst);

  if (isGlob(copyTask.src)) {
    const copyTasks = await processGlob(config, destinations, copyTask);
    allCopyTasks.push(...copyTasks);
    return;
  }

  await Promise.all(destinations.map(dst => {
    return processCopyTaskDestDir(config, allCopyTasks, copyTask, dst);
  }));
}


export async function processCopyTaskDestDir(config: d.Config, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask, destAbsDir: string) {
  const processedCopyTask: d.CopyTask = {
    src: getSrcAbsPath(config, copyTask.src),
    dest: getDestAbsPath(copyTask.src, destAbsDir, copyTask.dest)
  };
  if (typeof copyTask.warn === 'boolean') {
    processedCopyTask.warn = copyTask.warn;
  }
  allCopyTasks.push(processedCopyTask);
}


export async function processGlob(config: d.Config, destinations: string[], copyTask: d.CopyTask) {
  const globCopyTasks: d.CopyTask[] = [];

  const globOpts = {
    cwd: config.srcDir,
    nodir: true
  };

  const files = await sys.glob(copyTask.src, globOpts);
  files.forEach(globRelPath => {
    destinations.forEach(dst => {
      globCopyTasks.push(createGlobCopyTask(config, copyTask, dst, globRelPath));
    });
  });

  return globCopyTasks;
}


export function createGlobCopyTask(config: d.Config, copyTask: d.CopyTask, destDir: string, globRelPath: string) {
  const processedCopyTask: d.CopyTask = {
    src: sys.path.join(config.srcDir, globRelPath),
  };

  if (copyTask.dest) {
    if (sys.path.isAbsolute(copyTask.dest)) {
      processedCopyTask.dest = sys.path.join(copyTask.dest, sys.path.basename(globRelPath));

    } else {
      processedCopyTask.dest = sys.path.join(destDir, copyTask.dest, sys.path.basename(globRelPath));
    }

  } else {
    processedCopyTask.dest = sys.path.join(destDir, globRelPath);
  }

  return processedCopyTask;
}


export function getSrcAbsPath(config: d.Config, src: string) {
  if (sys.path.isAbsolute(src)) {
    return src;
  }

  return sys.path.join(config.srcDir, src);
}


export function getDestAbsPath(src: string, destAbsPath: string, destRelPath: string) {
  if (destRelPath) {
    if (sys.path.isAbsolute(destRelPath)) {
      return destRelPath;

    } else {
      return sys.path.join(destAbsPath, destRelPath);
    }
  }

  if (sys.path.isAbsolute(src)) {
    throw new Error(`copy task, "to" property must exist if "from" property is an absolute path: ${src}`);
  }

  return sys.path.join(destAbsPath, src);
}


export function isCopyTaskFile(config: d.Config, filePath: string) {
  if (!Array.isArray(config.copy)) {
    // there is no copy config
    return false;
  }

  filePath = normalizePath(filePath);

  // go through all the copy tasks and see if this path matches
  for (let i = 0; i < config.copy.length; i++) {
    var copySrc = config.copy[i].src;

    if (isGlob(copySrc)) {
      // test the glob
      copySrc = sys.path.join(config.srcDir, copySrc);
      if (minimatch(filePath, copySrc)) {
        return true;
      }

    } else {
      copySrc = normalizePath(getSrcAbsPath(config, copySrc));

      if (!sys.path.relative(copySrc, filePath).startsWith('.')) {
        return true;
      }
    }
  }

  return false;
}
