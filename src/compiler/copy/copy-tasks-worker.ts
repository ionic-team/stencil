import * as d from '../../declarations';
import { buildError, catchError, flatOne, normalizePath, unique } from '@utils';
import { NodeFs } from '../../sys/node/node-fs';
import path from 'path';
import glob from 'glob';
import isGlob from 'is-glob';


export async function copyTasksWorker(copyTasks: Required<d.CopyTask>[], srcDir: string) {
  const results: d.CopyResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: []
  };

  try {
    const fs = new NodeFs(process);

    copyTasks = flatOne(await Promise.all(
      copyTasks.map(task => processGlobs(task, srcDir))
    ));

    copyTasks = unique(copyTasks, task => task.dest);

    const allCopyTasks: d.CopyTask[] = [];

    // figure out all the file copy tasks we'll have
    // by digging down through any directory copy tasks
    while (copyTasks.length > 0) {
      const tasks = copyTasks.splice(0, 100);

      await Promise.all(tasks.map(async copyTask => {
        await processCopyTask(fs, results, allCopyTasks, copyTask);
      }));
    }

    // figure out which directories we'll need to make first
    const mkDirs = ensureDirs(allCopyTasks);

    try {
      await Promise.all(
        mkDirs.map(dir => fs.mkdir(dir, { recursive: true }))
      );
    } catch (mkDirErr) {}

    while (allCopyTasks.length > 0) {
      const tasks = allCopyTasks.splice(0, 100);

      await Promise.all(tasks.map(async copyTask => {
        await fs.copyFile(copyTask.src, copyTask.dest);
      }));
    }

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
}


async function processGlobs(copyTask: Required<d.CopyTask>, srcDir: string): Promise<Required<d.CopyTask>[]> {
  return isGlob(copyTask.src)
    ? await processGlobTask(copyTask, srcDir)
    : [{
      src: getSrcAbsPath(srcDir, copyTask.src),
      dest: copyTask.keepDirStructure
        ? path.join(copyTask.dest, copyTask.src)
        : copyTask.dest,
      warn: copyTask.warn,
      keepDirStructure: copyTask.keepDirStructure
    }];
}

function getSrcAbsPath(srcDir: string, src: string) {
  if (path.isAbsolute(src)) {
    return src;
  }
  return path.join(srcDir, src);
}

async function processGlobTask(copyTask: Required<d.CopyTask>, srcDir: string): Promise<Required<d.CopyTask>[]> {
  const files = await asyncGlob(copyTask.src, {
    cwd: srcDir,
    nodir: true
  });
  return files.map(globRelPath => createGlobCopyTask(copyTask, srcDir, globRelPath));
}


function createGlobCopyTask(copyTask: Required<d.CopyTask>, srcDir: string, globRelPath: string): Required<d.CopyTask> {
  const dest = path.join(copyTask.dest, copyTask.keepDirStructure
    ? globRelPath
    : path.basename(globRelPath)
  );
  return {
    src: path.join(srcDir, globRelPath),
    dest,
    warn: copyTask.warn,
    keepDirStructure: copyTask.keepDirStructure
  };
}


async function processCopyTask(fs: NodeFs, results: d.CopyResults, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask) {
  try {
    copyTask.src = normalizePath(copyTask.src);
    copyTask.dest = normalizePath(copyTask.dest);

    // get the stats for this src to see if it's a directory or not
    const stats = await fs.stat(copyTask.src);
    if (stats.isDirectory()) {
      // still a directory, keep diggin down
      if (!results.dirPaths.includes(copyTask.dest)) {
        results.dirPaths.push(copyTask.dest);
      }

      await processCopyTaskDirectory(fs, results, allCopyTasks, copyTask);

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


async function processCopyTaskDirectory(fs: NodeFs, results: d.CopyResults, allCopyTasks: d.CopyTask[], copyTask: d.CopyTask) {
  try {
    const dirItems = await fs.readdir(copyTask.src);

    await Promise.all(dirItems.map(async dirItem => {
      const subCopyTask: d.CopyTask = {
        src: path.join(copyTask.src, dirItem),
        dest: path.join(copyTask.dest, dirItem),
        warn: copyTask.warn
      };

      await processCopyTask(fs, results, allCopyTasks, subCopyTask);
    }));

  } catch (e) {
    catchError(results.diagnostics, e);
  }
}


function ensureDirs(copyTasks: d.CopyTask[]) {
  const mkDirs: string[] = [];

  copyTasks.forEach(copyTask => {
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

  if (destDir === ROOT_DIR || (destDir + '/') === ROOT_DIR || destDir === '') {
    return;
  }

  if (!mkDirs.includes(destDir)) {
    mkDirs.push(destDir);
  }
}


const ROOT_DIR = normalizePath(path.resolve('/'));


function shouldIgnore(filePath: string) {
  filePath = filePath.trim().toLowerCase();
  return IGNORE.some(ignoreFile => filePath.endsWith(ignoreFile));
}

const IGNORE = [
  '.ds_store',
  '.gitignore',
  'desktop.ini',
  'thumbs.db'
];


function asyncGlob(pattern: string, opts: any) {
  return new Promise<string[]>((resolve, reject) => {
    glob(pattern, opts, (err: any, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}
