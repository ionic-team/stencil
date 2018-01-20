import { FileSystem, FsCopyFileTask, FsItems, FsReadOptions, FsReaddirItem,
  FsReaddirOptions, FsWriteOptions, FsWriteResults, Path } from '../declarations';
import { normalizePath } from '../compiler/util';


export class InMemoryFileSystem {
  private d: FsItems = {};
  private copyFileTasks: FsCopyFileTask[] = [];

  constructor(public fs: FileSystem, private path: Path) {}

  async access(filePath: string) {
    filePath = normalizePath(filePath);
    if (this.d[filePath]) {
      return !!this.d[filePath].exists;
    }

    let hasAccess = false;
    try {
      const s = await this.stat(filePath);
      this.d[filePath] = {
        exists: true,
        isDirectory: s.isDirectory,
        isFile: s.isFile
      };
      hasAccess = true;

    } catch (e) {
      this.d[filePath] = {
        exists: false
      };
    }

    return hasAccess;
  }

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  accessSync(filePath: string) {
    filePath = normalizePath(filePath);
    if (this.d[filePath]) {
      return !!this.d[filePath].exists;
    }

    let hasAccess = false;
    try {
      const s = this.statSync(filePath);
      this.d[filePath] = {
        exists: true,
        isDirectory: s.isDirectory,
        isFile: s.isFile
      };
      hasAccess = true;

    } catch (e) {
      this.d[filePath] = {
        exists: false
      };
    }

    return hasAccess;
  }

  async copy(src: string, dest: string, opts?: { filter?: (src: string, dest?: string) => boolean; }) {
    const stats = await this.stat(src);

    if (stats.isDirectory) {
      await this.copyDir(src, dest, opts);

    } else if (stats.isFile) {
      await this.copyFile(src, dest, opts);
    }
  }

  async copyDir(src: string, dest: string, opts?: { filter?: (src: string, dest?: string) => boolean; }) {
    src = normalizePath(src);
    dest = normalizePath(dest);

    const dirItems = await this.readdir(src, { recursive: true });

    await Promise.all(dirItems.map(async dirItem => {
      const srcPath = dirItem.absPath;
      const destPath = normalizePath(this.path.join(dest, dirItem.relPath));

      if (dirItem.isDirectory) {
        await this.copyDir(srcPath, destPath, opts);

      } else if (dirItem.isFile) {
        await this.copyFile(srcPath, destPath, opts);
      }
    }));
  }

  async copyFile(src: string, dest: string, opts?: { filter?: (src: string, dest?: string) => boolean; }) {
    src = normalizePath(src);
    dest = normalizePath(dest);

    if (opts && typeof opts.filter === 'function' && !opts.filter(src, dest)) {
      return;
    }

    this.copyFileTasks.push({
      src: src,
      dest: dest
    });
  }

  async emptyDir(dirPath: string) {
    dirPath = normalizePath(dirPath);

    await this.removeDir(dirPath);

    this.d[dirPath] = this.d[dirPath] || {};
    this.d[dirPath].isFile = false;
    this.d[dirPath].isDirectory = true;
    this.d[dirPath].queueWriteToDisk = true;
    this.d[dirPath].queueDeleteFromDisk = false;
  }

  async readdir(dirPath: string, opts: FsReaddirOptions = {}) {
    dirPath = normalizePath(dirPath);

    const collectedPaths: FsReaddirItem[] = [];

    // always a disk read
    await this.readDirectory(dirPath, dirPath, opts, collectedPaths);

    return collectedPaths.sort((a, b) => {
      if (a.absPath < b.absPath) return -1;
      if (a.absPath > b.absPath) return 1;
      return 0;
    });
  }

  private async readDirectory(initPath: string, dirPath: string, opts: FsReaddirOptions, collectedPaths: FsReaddirItem[]) {
    // used internally only so we could easily recursively drill down
    // loop through this directory and sub directories
    // always a disk read!!
    const dirItems = await this.fs.readdir(dirPath);

    // cache some facts about this path
    this.d[dirPath] = this.d[dirPath] || {};
    this.d[dirPath].exists = true;
    this.d[dirPath].isFile = false;
    this.d[dirPath].isDirectory = true;

    await Promise.all(dirItems.map(async dirItem => {
      // let's loop through each of the files we've found so far
      // create an absolute path of the item inside of this directory
      const absPath = normalizePath(this.path.join(dirPath, dirItem));
      const relPath = normalizePath(this.path.relative(initPath, absPath));

      // get the fs stats for the item, could be either a file or directory
      const stats = await this.stat(absPath);

      // cache some stats about this path
      this.d[absPath] = this.d[absPath] || {};
      this.d[absPath].exists = true;
      this.d[absPath].isDirectory = stats.isDirectory;
      this.d[absPath].isFile = stats.isFile;

      collectedPaths.push({
        absPath: absPath,
        relPath: relPath,
        isDirectory: stats.isDirectory,
        isFile: stats.isFile
      });

      if (opts.recursive && stats.isDirectory) {
        // looks like it's yet another directory
        // let's keep drilling down
        await this.readDirectory(initPath, absPath, opts, collectedPaths);
      }
    }));
  }

  async readFile(filePath: string, opts?: FsReadOptions) {
    filePath = normalizePath(filePath);

    if (!opts || (opts.useCache === true || opts.useCache === undefined)) {
      const f = this.d[filePath];
      if (f && f.exists && typeof f.fileText === 'string') {
        return f.fileText;
      }
    }

    const fileContent = await this.fs.readFile(filePath, 'utf-8');

    const f = this.d[filePath] = this.d[filePath] || {};
    f.exists = true;
    f.isFile = true;
    f.isDirectory = false;
    f.fileText = fileContent;

    return fileContent;
  }

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  readFileSync(filePath: string) {
    filePath = normalizePath(filePath);
    let f = this.d[filePath];
    if (f && f.exists && typeof f.fileText === 'string') {
      return f.fileText;
    }

    const fileContent = this.fs.readFileSync(filePath, 'utf-8');

    f = this.d[filePath] = this.d[filePath] || {};
    f.exists = true;
    f.isFile = true;
    f.isDirectory = false;
    f.fileText = fileContent;

    return fileContent;
  }

  async removeDir(dirPath: string): Promise<any> {
    dirPath = normalizePath(dirPath);

    this.d[dirPath] = this.d[dirPath] || {};
    this.d[dirPath].isFile = false;
    this.d[dirPath].isDirectory = true;
    this.d[dirPath].queueDeleteFromDisk = true;

    try {
      const dirItems = await this.readdir(dirPath, { recursive: true });

      await Promise.all(dirItems.map(async item => {
        if (item.isDirectory) {
          await this.removeDir(item.absPath);

        } else if (item.isFile) {
          await this.removeFile(item.absPath);
        }
      }));

    } catch (e) {
      // do not throw error if the directory never existed
    }
  }

  async removeFile(filePath: string) {
    filePath = normalizePath(filePath);
    this.d[filePath] = this.d[filePath] || {};
    this.d[filePath].queueDeleteFromDisk = true;
  }

  async stat(itemPath: string) {
    itemPath = normalizePath(itemPath);

    let f = this.d[itemPath];
    if (!f || typeof f.isDirectory !== 'boolean' || typeof f.isFile !== 'boolean') {
      const s = await this.fs.stat(itemPath);
      f = this.d[itemPath] = {
        exists: true,
        isFile: s.isFile(),
        isDirectory: s.isDirectory()
      };
    }

    return {
      isFile: f.isFile,
      isDirectory: f.isDirectory
    };
  }

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param itemPath
   */
  statSync(itemPath: string) {
    itemPath = normalizePath(itemPath);

    let f = this.d[itemPath];
    if (!f || typeof f.isDirectory !== 'boolean' || typeof f.isFile !== 'boolean') {
      const s = this.fs.statSync(itemPath);
      f = this.d[itemPath] = {
        exists: true,
        isFile: s.isFile(),
        isDirectory: s.isDirectory()
      };
    }

    return {
      isFile: f.isFile,
      isDirectory: f.isDirectory
    };
  }

  async writeFile(filePath: string, content: string, opts?: FsWriteOptions) {
    const results: FsWriteResults = {};

    if (typeof filePath !== 'string') {
      throw new Error(`writeFile, invalid filePath: ${filePath}`);
    }

    filePath = normalizePath(filePath);

    if (typeof content !== 'string') {
      throw new Error(`writeFile, invalid content: ${filePath}`);
    }

    const d = this.d[filePath] = this.d[filePath] || {};
    d.exists = true;
    d.isFile = true;
    d.isDirectory = false;
    d.queueDeleteFromDisk = false;

    results.changedContent = d.fileText !== content;
    results.queuedWrite = false;

    d.fileText = content;

    if (opts && opts.inMemoryOnly) {
      // we don't want to actually write this to disk
      // just keep it in memory
      if (d.queueWriteToDisk) {
        // we already queued this file to write to disk
        // in that case we still need to do it
        results.queuedWrite = true;

      } else {
        // we only want this in memory and
        // it wasn't already queued to be written
        d.queueWriteToDisk = false;
      }

    } else {
      // we want to write this to disk (eventually)
      // but only if the content is different
      // from our existing cached content
      if (!d.queueWriteToDisk && results.changedContent) {
        // not already queued to be written
        // and the content is different
        d.queueWriteToDisk = true;
        results.queuedWrite = true;
      }
    }

    return results;
  }

  writeFiles(files: { [filePath: string]: string }, opts?: FsWriteOptions) {
    return Promise.all(Object.keys(files).map(filePath => {
      return this.writeFile(filePath, files[filePath], opts);
    }));
  }

  async commitCopy() {
    const dirsToEnsure: string[] = [];

    const copyFileTasks: FsCopyFileTask[] = this.copyFileTasks.map(copyFileTask => {
      const dir = normalizePath(this.path.dirname(copyFileTask.dest));
      if (!dirsToEnsure.includes(dir)) {
        dirsToEnsure.push(dir);
      }
      return {
        src: copyFileTask.src,
        dest: copyFileTask.dest
      };
    });
    this.copyFileTasks.length = 0;

    // add all the ancestor directories for each directory too
    for (const dirToEnsure of dirsToEnsure) {
      const segments = dirToEnsure.split('/');

      for (let j = 2; j < segments.length; j++) {
        const dir = segments.slice(0, j).join('/');
        if (!dirsToEnsure.includes(dir)) {
          dirsToEnsure.push(dir);
        }
      }
    }

    // sort so the the shortest paths ensured first
    dirsToEnsure.sort((a, b) => {
      const segmentsA = a.split('/').length;
      const segmentsB = b.split('/').length;
      if (segmentsA < segmentsB) return -1;
      if (segmentsA > segmentsB) return 1;
      if (a.length < b.length) return -1;
      if (a.length > b.length) return 1;
      return 0;
    });

    await this.commitEnsureDirs(dirsToEnsure);

    return Promise.all(copyFileTasks.map(async copyFileTask => {
      await this.fs.copyFile(copyFileTask.src, copyFileTask.dest);
      return copyFileTask.dest;
    }));
  }

  async commit() {
    const instructions = getCommitInstructions(this.path, this.d);

    // ensure directories we need exist
    const dirsAdded = await this.commitEnsureDirs(instructions.dirsToEnsure);

    // write all queued the files
    const filesWritten = await this.commitWriteFiles(instructions.filesToWrite);

    // remove all the queued files to be deleted
    const filesDeleted = await this.commitDeleteFiles(instructions.filesToDelete);

    // remove all the queued dirs to be deleted
    const dirsDeleted = await this.commitDeleteDirs(instructions.dirsToDelete);

    instructions.filesToDelete.forEach(fileToDelete => {
      this.clearFileCache(fileToDelete);
    });

    instructions.dirsToDelete.forEach(dirToDelete => {
      this.clearDirCache(dirToDelete);
    });

    // return only the files that were
    return {
      filesWritten: filesWritten,
      filesDeleted: filesDeleted,
      dirsDeleted: dirsDeleted,
      dirsAdded: dirsAdded
    };
  }

  private async commitEnsureDirs(dirsToEnsure: string[]) {
    const dirsAdded: string[] = [];

    for (const dirPath of dirsToEnsure) {

      if (this.d[dirPath] && this.d[dirPath].exists && this.d[dirPath].isDirectory) {
        // already cached that this path is indeed an existing directory
        continue;
      }

      try {
        // cache that we know this is a directory on disk
        const d = this.d[dirPath] = this.d[dirPath] || {};
        d.exists = true;
        d.isDirectory = true;
        d.isFile = false;

        await this.fs.mkdir(dirPath);
        dirsAdded.push(dirPath);

      } catch (e) {}
    }

    return dirsAdded;
  }

  private commitWriteFiles(filesToWrite: string[]) {
    return Promise.all(filesToWrite.map(async filePath => {
      if (typeof filePath !== 'string') {
        throw new Error(`unable to writeFile without filePath`);
      }
      const item = this.d[filePath];
      if (item == null) {
        throw new Error(`unable to find item to write: ${filePath}`);
      }
      if (item.fileText == null) {
        throw new Error(`unable to find item fileText to write: ${filePath}`);
      }
      await this.fs.writeFile(filePath, item.fileText);

      return filePath;
    }));
  }

  private commitDeleteFiles(filesToDelete: string[]) {
    return Promise.all(filesToDelete.map(async filePath => {
      if (typeof filePath !== 'string') {
        throw new Error(`unable to unlink without filePath`);
      }
      await this.fs.unlink(filePath);
      return filePath;
    }));
  }

  private async commitDeleteDirs(dirsToDelete: string[]) {
    const dirsDeleted: string[] = [];

    for (const dirPath of dirsToDelete) {
      try {
        await this.fs.rmdir(dirPath);
      } catch (e) {}
      dirsDeleted.push(dirPath);
    }

    return dirsDeleted;
  }

  clearDirCache(dirPath: string) {
    dirPath = normalizePath(dirPath);

    const filePaths = Object.keys(this.d);

    filePaths.forEach(f => {
      const filePath = this.path.relative(dirPath, f).split('/')[0];
      if (!filePath.startsWith('.') && !filePath.startsWith('/')) {
        this.clearFileCache(f);
      }
    });
  }

  clearFileCache(filePath: string) {
    filePath = normalizePath(filePath);
    const item = this.d[filePath];
    if (item && !item.queueWriteToDisk) {
      delete this.d[filePath];
    }
  }

  getCache(itemPath: string) {
    itemPath = normalizePath(itemPath);
    const item = this.d[itemPath];
    if (item) {
      return {
        exists: item.exists,
        isDirectory: item.isDirectory,
        isFile: item.isFile,
        fileText: item.fileText
      };
    }
    return null;
  }

  clearCache() {
    this.d = {};
  }

  get disk() {
    return this.fs;
  }
}


export function getCommitInstructions(path: Path, d: FsItems) {
  const instructions = {
    filesToDelete: [] as string[],
    filesToWrite: [] as string[],
    dirsToDelete: [] as string[],
    dirsToEnsure: [] as string[]
  };

  Object.keys(d).forEach(filePath => {
    const item = d[filePath];

    if (item.queueWriteToDisk) {

      if (item.isFile) {
        instructions.filesToWrite.push(filePath);
        const dir = normalizePath(path.dirname(filePath));

        if (!instructions.dirsToEnsure.includes(dir)) {
          instructions.dirsToEnsure.push(dir);
        }

      } else if (item.isDirectory) {
        if (!instructions.dirsToEnsure.includes(filePath)) {
          instructions.dirsToEnsure.push(filePath);
        }
      }

    } else if (item.queueDeleteFromDisk) {
      if (item.isDirectory) {
        instructions.dirsToDelete.push(filePath);

      } else if (item.isFile) {
        instructions.filesToDelete.push(filePath);
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
      if (!instructions.dirsToEnsure.includes(dir)) {
        instructions.dirsToEnsure.push(dir);
      }
    }
  }

  // sort so the the shortest paths ensured first
  instructions.dirsToEnsure.sort((a, b) => {
    const segmentsA = a.split('/').length;
    const segmentsB = b.split('/').length;
    if (segmentsA < segmentsB) return -1;
    if (segmentsA > segmentsB) return 1;
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    return 0;
  });

  // sort so the the longest paths are removed first
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
    if (dir === '/' || dir.endsWith(':/')) {
      return false;
    }
    return true;
  });

  instructions.dirsToEnsure = instructions.dirsToEnsure.filter(dir => {
    if (d[dir] && d[dir].exists && d[dir].isDirectory) {
      return false;
    }
    if (dir === '/' || dir.endsWith(':/')) {
      return false;
    }
    return true;
  });

  return instructions;
}
