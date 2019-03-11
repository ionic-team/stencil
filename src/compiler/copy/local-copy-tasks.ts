import * as d from '@declarations';
import isGlob from 'is-glob';
import { sys } from '@sys';
import { flatOne, normalizePath } from '@utils';
import {performCopyTasks} from './copy-tasks';
import minimatch from 'minimatch';


export async function copyTasks(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tasks: d.CopyTask[], dest: string) {
  const allCopyTasks = await processCopyTasks(config, dest, tasks);
  return performCopyTasks(compilerCtx, buildCtx, allCopyTasks);
}

export async function processCopyTasks(config: d.Config, dest: string, tasks: d.CopyTask[]) {
  if (!tasks) {
    return [];
  }
  return flatOne(
    await Promise.all(tasks.map(task => processCopyTask(config, dest, task)))
  );
}

async function processCopyTask(config: d.Config, dest: string, copyTask: d.CopyTask): Promise<d.CopyTask[]> {
  if (!copyTask.src) {
    throw new Error(`copy missing "src" property`);
  }

  if (copyTask.dest && isGlob(copyTask.dest)) {
    throw new Error(`copy "dest" property cannot be a glob: ${copyTask.dest}`);
  }

  return isGlob(copyTask.src)
    ? await processGlobTask(config, copyTask, dest)
    : [processSimpleTask(config, copyTask, dest)];
}


function processSimpleTask(config: d.Config, copyTask: d.CopyTask, destAbsDir: string): d.CopyTask {
  return {
    src: getSrcAbsPath(config, copyTask.src),
    dest: getDestAbsPath(copyTask.src, destAbsDir, copyTask.dest),
    warn: !!copyTask.warn
  };
}


async function processGlobTask(config: d.Config, copyTask: d.CopyTask, dest: string): Promise<d.CopyTask[]> {
  const globOpts = {
    cwd: config.srcDir,
    nodir: true
  };
  const files = await sys.glob(copyTask.src, globOpts);
  return files.map(globRelPath => createGlobCopyTask(config, copyTask, dest, globRelPath));
}


function createGlobCopyTask(config: d.Config, copyTask: d.CopyTask, destDir: string, globRelPath: string): d.CopyTask {
  let dest = copyTask.dest;
  if (dest) {
    if (sys.path.isAbsolute(dest)) {
      dest = sys.path.join(dest, sys.path.basename(globRelPath));

    } else {
      dest = sys.path.join(destDir, dest, sys.path.basename(globRelPath));
    }

  } else {
    dest = sys.path.join(destDir, globRelPath);
  }

  return {
    src: sys.path.join(config.srcDir, globRelPath),
    dest,
  };
}


function getSrcAbsPath(config: d.Config, src: string) {
  if (sys.path.isAbsolute(src)) {
    return src;
  }
  return sys.path.join(config.srcDir, src);
}


function getDestAbsPath(src: string, destAbsPath: string, destRelPath: string) {
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
