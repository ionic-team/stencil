import { buildError, catchError, flatOne, isGlob, normalizePath } from '@utils';
import glob from 'glob';
import path from 'path';
import { copyFile, mkdir, readdir, stat } from './node-fs-promisify';
export async function nodeCopyTasks(copyTasks, srcDir) {
    const results = {
        diagnostics: [],
        dirPaths: [],
        filePaths: [],
    };
    try {
        copyTasks = flatOne(await Promise.all(copyTasks.map((task) => processGlobs(task, srcDir))));
        const allCopyTasks = [];
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
        }
        catch (mkDirErr) { }
        while (allCopyTasks.length > 0) {
            const tasks = allCopyTasks.splice(0, 100);
            await Promise.all(tasks.map((copyTask) => copyFile(copyTask.src, copyTask.dest)));
        }
    }
    catch (e) {
        catchError(results.diagnostics, e);
    }
    return results;
}
async function processGlobs(copyTask, srcDir) {
    return isGlob(copyTask.src)
        ? await processGlobTask(copyTask, srcDir)
        : [
            {
                src: getSrcAbsPath(srcDir, copyTask.src),
                dest: copyTask.keepDirStructure ? path.join(copyTask.dest, copyTask.src) : copyTask.dest,
                warn: copyTask.warn,
                keepDirStructure: copyTask.keepDirStructure,
            },
        ];
}
function getSrcAbsPath(srcDir, src) {
    if (path.isAbsolute(src)) {
        return src;
    }
    return path.join(srcDir, src);
}
async function processGlobTask(copyTask, srcDir) {
    const files = await asyncGlob(copyTask.src, {
        cwd: srcDir,
        nodir: true,
    });
    return files.map((globRelPath) => createGlobCopyTask(copyTask, srcDir, globRelPath));
}
function createGlobCopyTask(copyTask, srcDir, globRelPath) {
    const dest = path.join(copyTask.dest, copyTask.keepDirStructure ? globRelPath : path.basename(globRelPath));
    return {
        src: path.join(srcDir, globRelPath),
        dest,
        warn: copyTask.warn,
        keepDirStructure: copyTask.keepDirStructure,
    };
}
async function processCopyTask(results, allCopyTasks, copyTask) {
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
        }
        else if (!shouldIgnore(copyTask.src)) {
            // this is a file we should copy
            if (!results.filePaths.includes(copyTask.dest)) {
                results.filePaths.push(copyTask.dest);
            }
            allCopyTasks.push(copyTask);
        }
    }
    catch (e) {
        if (copyTask.warn !== false) {
            const err = buildError(results.diagnostics);
            if (e instanceof Error) {
                err.messageText = e.message;
            }
        }
    }
}
async function processCopyTaskDirectory(results, allCopyTasks, copyTask) {
    try {
        const dirItems = await readdir(copyTask.src);
        await Promise.all(dirItems.map(async (dirItem) => {
            const subCopyTask = {
                src: path.join(copyTask.src, dirItem),
                dest: path.join(copyTask.dest, dirItem),
                warn: copyTask.warn,
            };
            await processCopyTask(results, allCopyTasks, subCopyTask);
        }));
    }
    catch (e) {
        catchError(results.diagnostics, e);
    }
}
function ensureDirs(copyTasks) {
    const mkDirs = [];
    copyTasks.forEach((copyTask) => {
        addMkDir(mkDirs, path.dirname(copyTask.dest));
    });
    mkDirs.sort((a, b) => {
        const partsA = a.split('/').length;
        const partsB = b.split('/').length;
        if (partsA < partsB)
            return -1;
        if (partsA > partsB)
            return 1;
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });
    return mkDirs;
}
function addMkDir(mkDirs, destDir) {
    destDir = normalizePath(destDir);
    if (destDir === ROOT_DIR || destDir + '/' === ROOT_DIR || destDir === '') {
        return;
    }
    if (!mkDirs.includes(destDir)) {
        mkDirs.push(destDir);
    }
}
const ROOT_DIR = normalizePath(path.resolve('/'));
function shouldIgnore(filePath) {
    filePath = filePath.trim().toLowerCase();
    return IGNORE.some((ignoreFile) => filePath.endsWith(ignoreFile));
}
const IGNORE = ['.ds_store', '.gitignore', 'desktop.ini', 'thumbs.db'];
export function asyncGlob(pattern, opts) {
    return new Promise((resolve, reject) => {
        const g = glob.glob;
        g(pattern, opts, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    });
}
//# sourceMappingURL=node-copy-tasks.js.map