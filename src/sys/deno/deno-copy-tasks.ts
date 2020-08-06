import type * as d from '../../declarations';
import type { Deno } from '../../../types/lib.deno';
import { buildError, catchError, flatOne, normalizePath } from '@utils';
import { basename, dirname, expandGlob, isGlob, isAbsolute, join, resolve } from './deps';

export async function denoCopyTasks(deno: typeof Deno, copyTasks: Required<d.CopyTask>[], srcDir: string) {
  const results: d.CopyResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: [],
  };

  try {
    copyTasks = flatOne(await Promise.all(copyTasks.map(task => processGlobs(task, srcDir))));

    const allCopyTasks: d.CopyTask[] = [];

    // figure out all the file copy tasks we'll have
    // by digging down through any directory copy tasks
    while (copyTasks.length > 0) {
      const tasks = copyTasks.splice(0, 100);

      await Promise.all(tasks.map(copyTask => processCopyTask(deno, results, allCopyTasks, copyTask)));
    }

    // figure out which directories we'll need to make first
    const mkDirs = ensureDirs(allCopyTasks);

    try {
      await Promise.all(mkDirs.map(dir => deno.mkdir(dir, { recursive: true })));
    } catch (mkDirErr) {}

    while (allCopyTasks.length > 0) {
      const tasks = allCopyTasks.splice(0, 100);

      await Promise.all(tasks.map(copyTask => deno.copyFile(copyTask.src, copyTask.dest)));
    }
  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}

async function processGlobs(copyTask: Required<d.CopyTask>, srcDir: string): Promise<Required<d.CopyTask>[]> {
  return isGlob(copyTask.src)
    ? await processGlobTask(copyTask, srcDir)
    : [
        {
          src: getSrcAbsPath(srcDir, copyTask.src),
          dest: copyTask.keepDirStructure ? join(copyTask.dest, copyTask.src) : copyTask.dest,
          warn: copyTask.warn,
          keepDirStructure: copyTask.keepDirStructure,
        },
      ];
}

function getSrcAbsPath(srcDir: string, src: string) {
  if (isAbsolute(src)) {
    return src;
  }
  return join(srcDir, src);
}

async function processGlobTask(copyTask: Required<d.CopyTask>, srcDir: string): Promise<Required<d.CopyTask>[]> {
  const copyTasks: Required<d.CopyTask>[] = [];

  for await (const walkEntry of expandGlob(copyTask.src, { root: srcDir })) {
    const ct = createGlobCopyTask(copyTask, srcDir, walkEntry.name);
    copyTasks.push(ct);
  }
  return copyTasks;
}

function createGlobCopyTask(copyTask: Required<d.CopyTask>, srcDir: string, globRelPath: string): Required<d.CopyTask> {
  const dest = join(copyTask.dest, copyTask.keepDirStructure ? globRelPath : basename(globRelPath));
  return {
    src: join(srcDir, globRelPath),
    dest,
    warn: copyTask.warn,
    keepDirStructure: copyTask.keepDirStructure,
  };
}

async function processCopyTask(deno: typeof Deno, results: d.CopyResults, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask) {
  try {
    copyTask.src = normalizePath(copyTask.src);
    copyTask.dest = normalizePath(copyTask.dest);

    // get the stats for this src to see if it's a directory or not
    const stats = await deno.stat(copyTask.src);
    if (stats.isDirectory) {
      // still a directory, keep diggin down
      if (!results.dirPaths.includes(copyTask.dest)) {
        results.dirPaths.push(copyTask.dest);
      }

      await processCopyTaskDirectory(deno, results, allCopyTasks, copyTask);
    } else if (!shouldIgnore(copyTask.src)) {
      // this is a file we should copy
      if (!results.filePaths.includes(copyTask.dest)) {
        results.filePaths.push(copyTask.dest);
      }

      allCopyTasks.push(copyTask);
    }
  } catch (e) {
    if (copyTask.warn !== false) {
      const err = buildError(results.diagnostics);
      err.messageText = e.message;
    }
  }
}

async function processCopyTaskDirectory(deno: typeof Deno, results: d.CopyResults, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask) {
  try {
    for await (const dirEntry of deno.readDir(copyTask.src)) {
      const subCopyTask: d.CopyTask = {
        src: join(copyTask.src, dirEntry.name),
        dest: join(copyTask.dest, dirEntry.name),
        warn: copyTask.warn,
      };

      await processCopyTask(deno, results, allCopyTasks, subCopyTask);
    }
  } catch (e) {
    catchError(results.diagnostics, e);
  }
}

function ensureDirs(copyTasks: d.CopyTask[]) {
  const mkDirs: string[] = [];

  copyTasks.forEach(copyTask => {
    addMkDir(mkDirs, dirname(copyTask.dest));
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

const ROOT_DIR = normalizePath(resolve('/'));

function shouldIgnore(filePath: string) {
  filePath = filePath.trim().toLowerCase();
  return IGNORE.some(ignoreFile => filePath.endsWith(ignoreFile));
}

const IGNORE = ['.ds_store', '.gitignore', 'desktop.ini', 'thumbs.db'];
