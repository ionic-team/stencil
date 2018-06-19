import * as d from '../../declarations';
import { buildError, catchError, normalizePath } from '../util';
import { NodeFs } from '../../sys/node/node-fs';
import * as path from 'path';


export async function copyTasksWorker(copyTasks: d.CopyTask[]) {
  const results: d.CopyResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: []
  };

  try {
    const fs = new NodeFs();

    const allCopyTasks: d.CopyTask[] = [];

    // figure out all the file copy tasks we'll have
    // by digging down through any directory copy tasks
    await Promise.all(copyTasks.map(async copyTask => {
      await processCopyTask(fs, results, allCopyTasks, copyTask);
    }));

    // figure out which directories we'll need to make first
    const mkDirs = ensureDirs(allCopyTasks);
    for (const mkDir of mkDirs) {
      try {
        await fs.mkdir(mkDir);
      } catch (mkDirErr) {}
    }

    // begin copying all the files
    await Promise.all(allCopyTasks.map(async copyTask => {
      await fs.copyFile(copyTask.src, copyTask.dest);
    }));

  } catch (e) {
    catchError(results.diagnostics, e);
  }

  return results;
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


export function ensureDirs(copyTasks: d.CopyTask[]) {
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

  if (destDir === ROOT_DIR || destDir === '') {
    return;
  }

  if (!mkDirs.includes(destDir)) {
    mkDirs.push(destDir);
  }

  const parts = destDir.split('/');
  if (parts.length === 1) {
    return;
  }
  parts.pop();

  const subDestDir = parts.join('/');
  addMkDir(mkDirs, subDestDir);
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
