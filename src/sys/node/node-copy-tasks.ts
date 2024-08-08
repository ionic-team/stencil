import { buildError, catchError, flatOne, isGlob, normalizePath } from '@utils';
import { glob, type GlobOptions } from 'glob';
import path from 'path';

import type * as d from '../../declarations';
import { copyFile, mkdir, readdir, stat } from './node-fs-promisify';

export async function nodeCopyTasks(copyTasks: Required<d.CopyTask>[], srcDir: string) {
  const results: d.CopyResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: [],
  };

  try {
    copyTasks = flatOne(await Promise.all(copyTasks.map((task) => processGlobTask(task, srcDir))));

    const allCopyTasks: d.CopyTask[] = [];

    // figure out all the file copy tasks we'll have
    // by digging down through any directory copy tasks
    while (copyTasks.length > 0) {
      const tasks = copyTasks.splice(0, 100);

      await Promise.all(tasks.map((copyTask) => processCopyTask(results, allCopyTasks, copyTask)));
    }

    // figure out which directories we'll need to make first
    const mkDirs = ensureDirs(allCopyTasks);

    try {
      await Promise.all(mkDirs.map((dir) => mkdir(dir, { recursive: true })));
    } catch (mkDirErr) {}

    while (allCopyTasks.length > 0) {
      const tasks = allCopyTasks.splice(0, 100);

      await Promise.all(tasks.map((copyTask) => copyFile(copyTask.src, copyTask.dest)));
    }
  } catch (e: any) {
    catchError(results.diagnostics, e);
  }

  return results;
}

async function processGlobTask(copyTask: Required<d.CopyTask>, srcDir: string): Promise<Required<d.CopyTask>[]> {
  /**
   * To properly match all files within a certain directory we have to ensure to attach a `/**` to
   * the end of the pattern. However we only want to do this if the `src` entry is not a glob pattern
   * already or a file with an extension.
   */
  const pattern =
    isGlob(copyTask.src) || path.extname(copyTask.src).length > 0
      ? copyTask.src
      : './' + path.relative(srcDir, path.join(path.resolve(srcDir, copyTask.src), '**')).replaceAll(path.sep, '/');

  const files = await asyncGlob(pattern, {
    cwd: srcDir,
    nodir: true,
    absolute: false,
    ignore: copyTask.ignore,
  });
  return files.map((globRelPath) => createGlobCopyTask(copyTask, srcDir, globRelPath));
}

function createGlobCopyTask(copyTask: Required<d.CopyTask>, srcDir: string, globRelPath: string): Required<d.CopyTask> {
  const dest = path.join(copyTask.dest, copyTask.keepDirStructure ? globRelPath : path.basename(globRelPath));
  return {
    src: path.join(srcDir, globRelPath),
    dest,
    ignore: copyTask.ignore,
    warn: copyTask.warn,
    keepDirStructure: copyTask.keepDirStructure,
  };
}

async function processCopyTask(results: d.CopyResults, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask) {
  try {
    copyTask.src = normalizePath(copyTask.src);
    copyTask.dest = normalizePath(copyTask.dest);

    // get the stats for this src to see if it's a directory or not
    const stats = await stat(copyTask.src);
    if (stats.isDirectory()) {
      // still a directory, keep digging down
      if (!results.dirPaths.includes(copyTask.dest)) {
        results.dirPaths.push(copyTask.dest);
      }

      await processCopyTaskDirectory(results, allCopyTasks, copyTask);
    } else {
      // this is a file we should copy
      if (!results.filePaths.includes(copyTask.dest)) {
        results.filePaths.push(copyTask.dest);
      }

      allCopyTasks.push(copyTask);
    }
  } catch (e) {
    if (copyTask.warn !== false) {
      const err = buildError(results.diagnostics);
      if (e instanceof Error) {
        err.messageText = e.message;
      }
    }
  }
}

async function processCopyTaskDirectory(results: d.CopyResults, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask) {
  try {
    const dirItems = await readdir(copyTask.src);

    await Promise.all(
      dirItems.map(async (dirItem) => {
        const subCopyTask: d.CopyTask = {
          src: path.join(copyTask.src, dirItem),
          dest: path.join(copyTask.dest, dirItem),
          warn: copyTask.warn,
        };

        await processCopyTask(results, allCopyTasks, subCopyTask);
      }),
    );
  } catch (e: any) {
    catchError(results.diagnostics, e);
  }
}

function ensureDirs(copyTasks: d.CopyTask[]) {
  const mkDirs: string[] = [];

  copyTasks.forEach((copyTask) => {
    addMkDir(mkDirs, path.dirname(copyTask.dest));
  });

  mkDirs.sort((a, b) => {
    const partsA = a.split('/').length;
    const partsB = b.split('/').length;

    if (partsA < partsB) return -1;
    if (partsA > partsB) return 1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  return mkDirs;
}

function addMkDir(mkDirs: string[], destDir: string) {
  destDir = normalizePath(destDir);

  if (destDir === ROOT_DIR || destDir + '/' === ROOT_DIR || destDir === '') {
    return;
  }

  if (!mkDirs.includes(destDir)) {
    mkDirs.push(destDir);
  }
}

const ROOT_DIR = normalizePath(path.resolve('/'));

export async function asyncGlob(pattern: string, opts: GlobOptions): Promise<string[]> {
  return glob(pattern, { ...opts, withFileTypes: false });
}
