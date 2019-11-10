import * as d from '../../declarations';
import { normalizePath, isString } from '@utils';
import path from 'path';


export const inMemoryFs = (sys: d.CompilerSystem) => {
  const items: d.FsItems = new Map();

  const accessData = async (filePath: string) => {
    const item = getItem(filePath);
    if (typeof item.exists === 'boolean') {
      return {
        exists: item.exists,
        isDirectory: item.isDirectory,
        isFile: item.isFile
      };
    }

    const data = {
      exists: false,
      isDirectory: false,
      isFile: false
    };

    const s = await stat(filePath);
    if (s) {
      item.exists = s.exists;
      item.isDirectory = s.isDirectory;
      item.isFile = s.isFile;

      data.exists = item.exists;
      data.isDirectory = item.isDirectory;
      data.isFile = item.isFile;

    } else {
      item.exists = false;
    }

    return data;
  };

  const access = async (filePath: string) => {
    const data = await accessData(filePath);
    return data.exists;
  };

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  const accessSync = (filePath: string) => {
    const item = getItem(filePath);
    if (typeof item.exists !== 'boolean') {
      const s = statSync(filePath);
      item.exists = s.exists;
      item.isDirectory = s.isDirectory;
      item.isFile = s.isFile;
    }
    return item.exists;
  };

  const copyFile = async (src: string, dest: string) => {
    const item = getItem(src);
    item.queueCopyFileToDest = dest;
  };

  const emptyDir = async (dirPath: string) => {
    const item = getItem(dirPath);

    await removeDir(dirPath);

    item.isFile = false;
    item.isDirectory = true;
    item.queueWriteToDisk = true;
    item.queueDeleteFromDisk = false;
  };

  const readdir = async (dirPath: string, opts: d.FsReaddirOptions = {}) => {
    dirPath = normalizePath(dirPath);

    const collectedPaths: d.FsReaddirItem[] = [];

    if (opts.inMemoryOnly === true) {
      let inMemoryDir = dirPath;
      if (!inMemoryDir.endsWith('/')) {
        inMemoryDir += '/';
      }

      const inMemoryDirs = dirPath.split('/');

      items.forEach((d, filePath) => {
        if (!filePath.startsWith(dirPath)) {
          return;
        }

        const parts = filePath.split('/');

        if (parts.length === inMemoryDirs.length + 1 || (opts.recursive && parts.length > inMemoryDirs.length)) {
          if (d.exists) {
            const item: d.FsReaddirItem = {
              absPath: filePath,
              relPath: parts[inMemoryDirs.length],
              isDirectory: d.isDirectory,
              isFile: d.isFile
            };
            collectedPaths.push(item);
          }
        }
      });

    } else {
      // always a disk read
      await readDirectory(dirPath, dirPath, opts, collectedPaths);
    }

    return collectedPaths.sort((a, b) => {
      if (a.absPath < b.absPath) return -1;
      if (a.absPath > b.absPath) return 1;
      return 0;
    });
  };

  const readDirectory = async (initPath: string, dirPath: string, opts: d.FsReaddirOptions, collectedPaths: d.FsReaddirItem[]) => {
    // used internally only so we could easily recursively drill down
    // loop through this directory and sub directories
    // always a disk read!!
    const dirItems = await sys.readdir(dirPath);
    if (dirItems.length > 0) {
      // cache some facts about this path
      const item = getItem(dirPath);
      item.exists = true;
      item.isFile = false;
      item.isDirectory = true;

      await Promise.all(dirItems.map(async dirItem => {
        // let's loop through each of the files we've found so far
        // create an absolute path of the item inside of this directory
        const absPath = normalizePath(dirItem);
        const relPath = normalizePath(path.relative(initPath, absPath));

        // get the fs stats for the item, could be either a file or directory
        const stats = await stat(absPath);

        collectedPaths.push({
          absPath: absPath,
          relPath: relPath,
          isDirectory: stats.isDirectory,
          isFile: stats.isFile
        });

        if (opts.recursive === true && stats.isDirectory === true) {
          // looks like it's yet another directory
          // let's keep drilling down
          await readDirectory(initPath, absPath, opts, collectedPaths);
        }
      }));
    }
  };

  const readFile = async (filePath: string, opts?: d.FsReadOptions) => {
    if (opts == null || (opts.useCache === true || opts.useCache === undefined)) {
      const item = getItem(filePath);
      if (item.exists && typeof item.fileText === 'string') {
        return item.fileText;
      }
    }

    const fileText = await sys.readFile(filePath);

    const item = getItem(filePath);
    if (typeof fileText === 'string') {
      if (fileText.length < MAX_TEXT_CACHE) {
        item.exists = true;
        item.isFile = true;
        item.isDirectory = false;
        item.fileText = fileText;
      }
    } else {
      item.exists = false;
    }

    return fileText;
  };

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  const readFileSync = (filePath: string, opts?: d.FsReadOptions) => {
    if (opts == null || (opts.useCache === true || opts.useCache === undefined)) {
      const item = getItem(filePath);
      if (item.exists && typeof item.fileText === 'string') {
        return item.fileText;
      }
    }

    const fileText = sys.readFileSync(filePath);

    const item = getItem(filePath);
    if (typeof fileText === 'string') {
      if (fileText.length < MAX_TEXT_CACHE) {
        item.exists = true;
        item.isFile = true;
        item.isDirectory = false;
        item.fileText = fileText;
      }
    } else {
      item.exists = false;
    }

    return fileText;
  };

  const remove = async (itemPath: string) => {
    const stats = await stat(itemPath);

    if (stats.isDirectory === true) {
      await removeDir(itemPath);

    } else if (stats.isFile === true) {
      await removeItem(itemPath);
    }
  };

  const removeDir = async (dirPath: string) => {
    const item = getItem(dirPath);
    item.isFile = false;
    item.isDirectory = true;
    if (!item.queueWriteToDisk) {
      item.queueDeleteFromDisk = true;
    }

    try {
      const dirItems = await readdir(dirPath, { recursive: true });

      await Promise.all(dirItems.map(item => removeItem(item.absPath)));

    } catch (e) {
      // do not throw error if the directory never existed
    }
  };

  const removeItem = async (filePath: string) => {
    const item = getItem(filePath);
    if (!item.queueWriteToDisk) {
      item.queueDeleteFromDisk = true;
    }
  };

  const stat = async (itemPath: string) => {
    const item = getItem(itemPath);

    if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
      const s = await sys.stat(itemPath);
      if (s) {
        item.exists = true;
        item.isDirectory = s.isDirectory();
        item.isFile = s.isFile();
        item.size = s.size;
      } else {
        item.exists = false;
      }
    }

    return {
      exists: !!item.exists,
      isFile: !!item.isFile,
      isDirectory: !!item.isDirectory,
      size: typeof item.size === 'number' ? item.size : 0
    };
  };

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param itemPath
   */
  const statSync = (itemPath: string) => {
    const item = getItem(itemPath);
    if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
      const s = sys.statSync(itemPath);
      if (s) {
        item.exists = true;
        item.isDirectory = s.isDirectory();
        item.isFile = s.isFile();
      } else {
        item.exists = false;
      }
    }

    return {
      exists: !!item.exists,
      isFile: !!item.isFile,
      isDirectory: !!item.isDirectory
    };
  };

  const writeFile = async (filePath: string, content: string, opts?: d.FsWriteOptions) => {
    if (!isString(filePath)) {
      throw new Error(`writeFile, invalid filePath: ${filePath}`);
    }

    if (!isString(content)) {
      throw new Error(`writeFile, invalid content: ${filePath}`);
    }

    const results: d.FsWriteResults = {
      ignored: false,
      changedContent: false,
      queuedWrite: false
    };

    if (shouldIgnore(filePath) === true) {
      results.ignored = true;
      return results;
    }

    const item = getItem(filePath);
    item.exists = true;
    item.isFile = true;
    item.isDirectory = false;
    item.queueDeleteFromDisk = false;

    results.changedContent = (item.fileText !== content);
    results.queuedWrite = false;

    item.fileText = content;

    if (opts != null) {
      if (isString(opts.outputTargetType)) {
        if (isString(item.outputTargetType)) {
          if (item.outputTargetType !== opts.outputTargetType) {
            throw new Error(`writeFile, ${filePath} already has output target "${item.outputTargetType}" but is being set to "${opts.outputTargetType}"`);
          }
        }
        item.outputTargetType = opts.outputTargetType;
      }
      if (opts.useCache === false) {
        item.useCache = false;
      }
    }

    if (opts != null && opts.inMemoryOnly === true) {
      // we don't want to actually write this to disk
      // just keep it in memory
      if (item.queueWriteToDisk) {
        // we already queued this file to write to disk
        // in that case we still need to do it
        results.queuedWrite = true;

      } else {
        // we only want this in memory and
        // it wasn't already queued to be written
        item.queueWriteToDisk = false;
      }

      // ensure in-memory directories are created
      await ensureDir(filePath, true);

    } else if (opts != null && opts.immediateWrite === true) {
      // if this is an immediate write then write the file
      // now and do not add it to the queue
      if (results.changedContent || opts.useCache !== true) {
        // writing the file to disk is a big deal and kicks off fs watchers
        // so let's just double check that the file is actually different first
        const existingFile = await sys.readFile(filePath);
        results.changedContent = (existingFile !== item.fileText);
        if (results.changedContent) {
          await ensureDir(filePath, false);
          await sys.writeFile(filePath, item.fileText);
        }
      }

    } else {
      // we want to write this to disk (eventually)
      // but only if the content is different
      // from our existing cached content
      if (!item.queueWriteToDisk && results.changedContent === true) {
        // not already queued to be written
        // and the content is different
        item.queueWriteToDisk = true;
        results.queuedWrite = true;
      }
    }

    return results;
  };

  const writeFiles = (files: { [filePath: string]: string }, opts?: d.FsWriteOptions) => {
    return Promise.all(Object.keys(files).map(filePath => {
      return writeFile(filePath, files[filePath], opts);
    }));
  };


  const commit = async () => {
    const instructions = getCommitInstructions(items);

    // ensure directories we need exist
    const dirsAdded = await commitEnsureDirs(instructions.dirsToEnsure, false);

    // write all queued the files
    const filesWritten = await commitWriteFiles(instructions.filesToWrite);

    // write all queued the files to copy
    const filesCopied = await commitCopyFiles(instructions.filesToCopy);

    // remove all the queued files to be deleted
    const filesDeleted = await commitDeleteFiles(instructions.filesToDelete);

    // remove all the queued dirs to be deleted
    const dirsDeleted = await commitDeleteDirs(instructions.dirsToDelete);

    instructions.filesToDelete.forEach(fileToDelete => {
      clearFileCache(fileToDelete);
    });

    instructions.dirsToDelete.forEach(dirToDelete => {
      clearDirCache(dirToDelete);
    });

    // return only the files that were
    return {
      filesCopied,
      filesWritten,
      filesDeleted,
      dirsDeleted,
      dirsAdded
    };
  };

  const ensureDir = async (p: string, inMemoryOnly: boolean) => {
    const allDirs: string[] = [];

    while (true) {
      p = path.dirname(p);
      if (typeof p === 'string' && p.length > 0 && p !== '/' && p.endsWith(':/') === false && p.endsWith(':\\') === false) {
        allDirs.push(p);
      } else {
        break;
      }
    }

    allDirs.reverse();

    await commitEnsureDirs(allDirs, inMemoryOnly);
  };

  const commitEnsureDirs = async (dirsToEnsure: string[], inMemoryOnly: boolean) => {
    const dirsAdded: string[] = [];

    for (const dirPath of dirsToEnsure) {
      const item = getItem(dirPath);

      if (item.exists === true && item.isDirectory === true) {
        // already cached that this path is indeed an existing directory
        continue;
      }

      try {
        // cache that we know this is a directory on disk
        item.exists = true;
        item.isDirectory = true;
        item.isFile = false;

        if (!inMemoryOnly) {
          await sys.mkdir(dirPath);
        }

        dirsAdded.push(dirPath);

      } catch (e) {}
    }

    return dirsAdded;
  };

  const commitCopyFiles = (filesToCopy: string[][]) => {
    const copiedFiles = Promise.all(filesToCopy.map(async data => {
      const src = data[0];
      const dest = data[1];
      await sys.copyFile(src, dest);
      return [src, dest];
    }));
    return copiedFiles;
  };

  const commitWriteFiles = (filesToWrite: string[]) => {
    const writtenFiles = Promise.all(filesToWrite.map(async filePath => {
      if (typeof filePath !== 'string') {
        throw new Error(`unable to writeFile without filePath`);
      }
      return commitWriteFile(filePath);
    }));
    return writtenFiles;
  };

  const commitWriteFile = async (filePath: string) => {
    const item = getItem(filePath);

    if (item.fileText == null) {
      throw new Error(`unable to find item fileText to write: ${filePath}`);
    }
    await sys.writeFile(filePath, item.fileText);

    if (item.useCache === false) {
      clearFileCache(filePath);
    }

    return filePath;
  };

  const commitDeleteFiles = async (filesToDelete: string[]) => {
    const deletedFiles = await Promise.all(filesToDelete.map(async filePath => {
      if (typeof filePath !== 'string') {
        throw new Error(`unable to unlink without filePath`);
      }
      await sys.unlink(filePath);
      return filePath;
    }));
    return deletedFiles;
  };

  const commitDeleteDirs = async (dirsToDelete: string[]) => {
    const dirsDeleted: string[] = [];

    for (const dirPath of dirsToDelete) {
      try {
        await sys.rmdir(dirPath);
      } catch (e) {}
      dirsDeleted.push(dirPath);
    }

    return dirsDeleted;
  };

  const clearDirCache = (dirPath: string) => {
    dirPath = normalizePath(dirPath);

    items.forEach((_, f) => {
      const filePath = path.relative(dirPath, f).split('/')[0];
      if (!filePath.startsWith('.') && !filePath.startsWith('/')) {
        clearFileCache(f);
      }
    });
  };

  const clearFileCache = (filePath: string) => {
    filePath = normalizePath(filePath);
    const item = items.get(filePath);
    if (item != null && !item.queueWriteToDisk) {
      items.delete(filePath);
    }
  };

  const cancelDeleteFilesFromDisk = (filePaths: string[]) => {
    filePaths.forEach(filePath => {
      const item = getItem(filePath);
      if (item.isFile === true && item.queueDeleteFromDisk === true) {
        item.queueDeleteFromDisk = false;
      }
    });
  };

  const cancelDeleteDirectoriesFromDisk = (dirPaths: string[]) => {
    dirPaths.forEach(dirPath => {
      const item = getItem(dirPath);
      if (item.queueDeleteFromDisk === true) {
        item.queueDeleteFromDisk = false;
      }
    });
  };

  const getItem = (itemPath: string): d.FsItem => {
    itemPath = normalizePath(itemPath);
    let item = items.get(itemPath);
    if (item != null) {
      return item;
    }

    items.set(itemPath, item = {
      exists: null,
      fileText: null,
      size: null,
      mtimeMs: null,
      isDirectory: null,
      isFile: null,
      queueCopyFileToDest: null,
      queueDeleteFromDisk: null,
      queueWriteToDisk: null,
      useCache: null,
      outputTargetType: null,
    });
    return item;
  };

  const clearCache = () => items.clear();

  const keys = () => Array.from(items.keys()).sort();

  const getMemoryStats = () => `data length: ${items.size}`;

  const getBuildOutputs = () => {
    const outputs: d.BuildOutput[] = [];

    items.forEach((item, filePath) => {
      if (isString(item.outputTargetType)) {
        let o = outputs.find(o => o.type === item.outputTargetType);
        if (!o) {
          o = {
            type: item.outputTargetType,
            files: [],
          };
          outputs.push(o);
        }
        o.files.push(filePath);
      }
    });

    outputs.forEach(o => o.files.sort());

    return outputs.sort((a, b) => {
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return 0;
    });
  };

  // only cache if it's less than 5MB-ish (using .length as a rough guess)
  // why 5MB? idk, seems like a good number for source text
  // it's pretty darn large to cover almost ALL legitimate source files
  // and anything larger is probably a REALLY large file and a rare case
  // which we don't need to eat up memory for
  const MAX_TEXT_CACHE = 5242880;

  const fs: d.InMemoryFileSystem = {
    access,
    accessSync,
    accessData,
    cancelDeleteDirectoriesFromDisk,
    cancelDeleteFilesFromDisk,
    clearCache,
    clearDirCache,
    clearFileCache,
    commit,
    copyFile,
    emptyDir,
    getBuildOutputs,
    getItem,
    getMemoryStats,
    keys,
    readFile,
    readFileSync,
    readdir,
    remove,
    stat,
    statSync,
    sys,
    writeFile,
    writeFiles
  };
  return fs;
};


export const getCommitInstructions = (items: d.FsItems) => {
  const instructions = {
    filesToDelete: [] as string[],
    filesToWrite: [] as string[],
    filesToCopy: [] as string[][],
    dirsToDelete: [] as string[],
    dirsToEnsure: [] as string[]
  };

  items.forEach((item, itemPath) => {

    if (item.queueWriteToDisk === true) {

      if (item.isFile === true) {
        instructions.filesToWrite.push(itemPath);

        const dir = normalizePath(path.dirname(itemPath));
        if (!instructions.dirsToEnsure.includes(dir)) {
          instructions.dirsToEnsure.push(dir);
        }

        const dirDeleteIndex = instructions.dirsToDelete.indexOf(dir);
        if (dirDeleteIndex > -1) {
          instructions.dirsToDelete.splice(dirDeleteIndex, 1);
        }

        const fileDeleteIndex = instructions.filesToDelete.indexOf(itemPath);
        if (fileDeleteIndex > -1) {
          instructions.filesToDelete.splice(fileDeleteIndex, 1);
        }

      } else if (item.isDirectory === true) {
        if (!instructions.dirsToEnsure.includes(itemPath)) {
          instructions.dirsToEnsure.push(itemPath);
        }

        const dirDeleteIndex = instructions.dirsToDelete.indexOf(itemPath);
        if (dirDeleteIndex > -1) {
          instructions.dirsToDelete.splice(dirDeleteIndex, 1);
        }
      }

    } else if (item.queueDeleteFromDisk === true) {
      if (item.isDirectory && !instructions.dirsToEnsure.includes(itemPath)) {
        instructions.dirsToDelete.push(itemPath);

      } else if (item.isFile && !instructions.filesToWrite.includes(itemPath)) {
        instructions.filesToDelete.push(itemPath);
      }

    } else if (typeof item.queueCopyFileToDest === 'string') {
      const src = itemPath;
      const dest = item.queueCopyFileToDest;
      instructions.filesToCopy.push([src, dest]);

      const dir = normalizePath(path.dirname(dest));
      if (!instructions.dirsToEnsure.includes(dir)) {
        instructions.dirsToEnsure.push(dir);
      }

      const dirDeleteIndex = instructions.dirsToDelete.indexOf(dir);
      if (dirDeleteIndex > -1) {
        instructions.dirsToDelete.splice(dirDeleteIndex, 1);
      }

      const fileDeleteIndex = instructions.filesToDelete.indexOf(dest);
      if (fileDeleteIndex > -1) {
        instructions.filesToDelete.splice(fileDeleteIndex, 1);
      }
    }

    item.queueDeleteFromDisk = false;
    item.queueWriteToDisk = false;
  });

  // add all the ancestor directories for each directory too
  for (let i = 0, ilen = instructions.dirsToEnsure.length; i < ilen; i++) {
    const segments = instructions.dirsToEnsure[i].split('/');

    for (let j = 2; j < segments.length; j++) {
      const dir = segments.slice(0, j).join('/');
      if (instructions.dirsToEnsure.includes(dir) === false) {
        instructions.dirsToEnsure.push(dir);
      }
    }
  }

  // sort directories so shortest paths are ensured first
  instructions.dirsToEnsure.sort((a, b) => {
    const segmentsA = a.split('/').length;
    const segmentsB = b.split('/').length;
    if (segmentsA < segmentsB) return -1;
    if (segmentsA > segmentsB) return 1;
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    return 0;
  });

  // sort directories so longest paths are removed first
  instructions.dirsToDelete.sort((a, b) => {
    const segmentsA = a.split('/').length;
    const segmentsB = b.split('/').length;
    if (segmentsA < segmentsB) return 1;
    if (segmentsA > segmentsB) return -1;
    if (a.length < b.length) return 1;
    if (a.length > b.length) return -1;
    return 0;
  });

  instructions.dirsToEnsure.forEach(dirToEnsure => {
    const i = instructions.dirsToDelete.indexOf(dirToEnsure);
    if (i > -1) {
      instructions.dirsToDelete.splice(i, 1);
    }
  });

  instructions.dirsToDelete = instructions.dirsToDelete.filter(dir => {
    if (dir === '/' || dir.endsWith(':/') === true) {
      return false;
    }
    return true;
  });

  instructions.dirsToEnsure = instructions.dirsToEnsure.filter(dir => {
    const item = items.get(dir);
    if (item != null && item.exists === true && item.isDirectory === true) {
      return false;
    }
    if (dir === '/' || dir.endsWith(':/')) {
      return false;
    }
    return true;
  });

  return instructions;
};


export const shouldIgnore = (filePath: string) => {
  filePath = filePath.trim().toLowerCase();
  return IGNORE.some(ignoreFile => filePath.endsWith(ignoreFile));
};

const IGNORE = [
  '.ds_store',
  '.gitignore',
  'desktop.ini',
  'thumbs.db'
];
