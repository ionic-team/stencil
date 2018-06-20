import * as d from '../declarations';
import { normalizePath } from '../compiler/util';


export class InMemoryFileSystem implements d.InMemoryFileSystem {
  private items: d.FsItems = {};

  constructor(public disk: d.FileSystem, private sys: d.StencilSystem) {}

  async accessData(filePath: string) {
    const item = this.getItem(filePath);

    const data = {
      exists: false,
      isDirectory: false,
      isFile: false
    };

    if (typeof item.exists === 'boolean') {
      data.exists = item.exists;
      data.isDirectory = item.isDirectory;
      data.isFile = item.isFile;
      return data;
    }

    try {
      const s = await this.stat(filePath);
      item.exists = true;
      item.isDirectory = s.isDirectory;
      item.isFile = s.isFile;

      data.exists = item.exists;
      data.isDirectory = item.isDirectory;
      data.isFile = item.isFile;

    } catch (e) {
      item.exists = false;
    }

    return data;
  }

  async access(filePath: string) {
    const data = await this.accessData(filePath);
    return data.exists;
  }

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  accessSync(filePath: string) {
    const item = this.getItem(filePath);

    if (typeof item.exists === 'boolean') {
      return item.exists;
    }

    let hasAccess = false;
    try {
      const s = this.statSync(filePath);
      item.exists = true;
      item.isDirectory = s.isDirectory;
      item.isFile = s.isFile;

      hasAccess = true;

    } catch (e) {
      item.exists = false;
    }

    return hasAccess;
  }

  async emptyDir(dirPath: string) {
    const item = this.getItem(dirPath);

    await this.removeDir(dirPath);

    item.isFile = false;
    item.isDirectory = true;
    item.queueWriteToDisk = true;
    item.queueDeleteFromDisk = false;
  }

  async readdir(dirPath: string, opts: d.FsReaddirOptions = {}) {
    dirPath = normalizePath(dirPath);

    const collectedPaths: d.FsReaddirItem[] = [];

    if (opts.inMemoryOnly) {
      let inMemoryDir = dirPath;
      if (!inMemoryDir.endsWith('/')) {
        inMemoryDir += '/';
      }

      const inMemoryDirs = dirPath.split('/');

      const filePaths = Object.keys(this.items);

      filePaths.forEach(filePath => {
        if (!filePath.startsWith(dirPath)) {
          return;
        }

        const parts = filePath.split('/');

        if (parts.length === inMemoryDirs.length + 1 || (opts.recursive && parts.length > inMemoryDirs.length)) {
          const d = this.items[filePath];

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
      await this.readDirectory(dirPath, dirPath, opts, collectedPaths);
    }

    return collectedPaths.sort((a, b) => {
      if (a.absPath < b.absPath) return -1;
      if (a.absPath > b.absPath) return 1;
      return 0;
    });
  }

  private async readDirectory(initPath: string, dirPath: string, opts: d.FsReaddirOptions, collectedPaths: d.FsReaddirItem[]) {
    // used internally only so we could easily recursively drill down
    // loop through this directory and sub directories
    // always a disk read!!
    const dirItems = await this.disk.readdir(dirPath);

    // cache some facts about this path
    const item = this.getItem(dirPath);
    item.exists = true;
    item.isFile = false;
    item.isDirectory = true;

    await Promise.all(dirItems.map(async dirItem => {
      // let's loop through each of the files we've found so far
      // create an absolute path of the item inside of this directory
      const absPath = normalizePath(this.sys.path.join(dirPath, dirItem));
      const relPath = normalizePath(this.sys.path.relative(initPath, absPath));

      // get the fs stats for the item, could be either a file or directory
      const stats = await this.stat(absPath);

      // cache some stats about this path
      const subItem = this.getItem(absPath);
      subItem.exists = true;
      subItem.isDirectory = stats.isDirectory;
      subItem.isFile = stats.isFile;

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

  hasFileChanged(filePath: string) {
    let hasFileChanged = true;

    try {
      let oldHash: string = null;
      const oldItem = this.getItem(filePath);

      if (oldItem.exists && oldItem.isFile && typeof oldItem.hash === 'string') {
        oldHash = oldItem.hash;
      }

      this.readFileSync(filePath, { useCache: false, setHash: true });

      if (oldHash != null) {
        const newItem = this.getItem(filePath);

        if (typeof newItem.hash === 'string') {
          hasFileChanged = (newItem.hash !== oldHash);
        }
      }

    } catch (e) {}

    return hasFileChanged;
  }

  setBuildHashes() {
    Object.keys(this.items).forEach(itemKey => {
      const item = this.items[itemKey];
      if (item && item.isFile && typeof item.fileText === 'string') {
        item.hash = this.getContentHash(item.fileText);
      }
    });
  }

  getContentHash(content: string) {
    return this.sys.generateContentHash(content, 32);
  }

  async readFile(filePath: string, opts?: d.FsReadOptions) {
    if (!opts || (opts.useCache === true || opts.useCache === undefined)) {
      const item = this.getItem(filePath);
      if (item.exists && typeof item.fileText === 'string') {
        return item.fileText;
      }
    }

    const fileContent = await this.disk.readFile(filePath, 'utf8');

    const item = this.getItem(filePath);
    if (fileContent.length < MAX_TEXT_CACHE) {
      item.exists = true;
      item.isFile = true;
      item.isDirectory = false;
      item.fileText = fileContent;
    }

    if (opts && opts.setHash && typeof fileContent === 'string') {
      item.hash = this.getContentHash(fileContent);
    }

    return fileContent;
  }

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param filePath
   */
  readFileSync(filePath: string, opts?: d.FsReadOptions) {
    if (!opts || (opts.useCache === true || opts.useCache === undefined)) {
      const item = this.getItem(filePath);
      if (item.exists && typeof item.fileText === 'string') {
        return item.fileText;
      }
    }

    const fileContent = this.disk.readFileSync(filePath, 'utf8');

    const item = this.getItem(filePath);
    if (fileContent.length < MAX_TEXT_CACHE) {
      item.exists = true;
      item.isFile = true;
      item.isDirectory = false;
      item.fileText = fileContent;
    }

    if (opts && opts.setHash && typeof fileContent === 'string') {
      item.hash = this.getContentHash(fileContent);
    }

    return fileContent;
  }

  async remove(itemPath: string) {
    const stats = await this.stat(itemPath);

    if (stats.isDirectory) {
      await this.removeDir(itemPath);

    } else if (stats.isFile) {
      await this.removeItem(itemPath);
    }
  }

  private async removeDir(dirPath: string) {
    const item = this.getItem(dirPath);
    item.isFile = false;
    item.isDirectory = true;
    if (!item.queueWriteToDisk) {
      item.queueDeleteFromDisk = true;
    }

    try {
      const dirItems = await this.readdir(dirPath, { recursive: true });

      await Promise.all(dirItems.map(async item => {
        await this.removeItem(item.absPath);
      }));

    } catch (e) {
      // do not throw error if the directory never existed
    }
  }

  private async removeItem(filePath: string) {
    const item = this.getItem(filePath);
    if (!item.queueWriteToDisk) {
      item.queueDeleteFromDisk = true;
    }
  }

  async stat(itemPath: string) {
    const item = this.getItem(itemPath);

    if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
      const s = await this.disk.stat(itemPath);
      item.exists = true;
      item.isDirectory = s.isDirectory();
      item.isFile = s.isFile();
      item.size = s.size;
    }

    return {
      exists: !!item.exists,
      isFile: !!item.isFile,
      isDirectory: !!item.isDirectory,
      size: typeof item.size === 'number' ? item.size : 0
    };
  }

  /**
   * Synchronous!!! Do not use!!!
   * (Only typescript transpiling is allowed to use)
   * @param itemPath
   */
  statSync(itemPath: string) {
    const item = this.getItem(itemPath);

    if (typeof item.isDirectory !== 'boolean' || typeof item.isFile !== 'boolean') {
      const s = this.disk.statSync(itemPath);
      item.exists = true;
      item.isDirectory = s.isDirectory();
      item.isFile = s.isFile();
    }

    return {
      isFile: item.isFile,
      isDirectory: item.isDirectory
    };
  }

  async writeFile(filePath: string, content: string, opts?: d.FsWriteOptions) {
    const results: d.FsWriteResults = {};

    if (typeof filePath !== 'string') {
      throw new Error(`writeFile, invalid filePath: ${filePath}`);
    }

    if (typeof content !== 'string') {
      throw new Error(`writeFile, invalid content: ${filePath}`);
    }

    if (shouldIgnore(filePath)) {
      results.ignored = true;
      return results;
    }

    const item = this.getItem(filePath);
    item.exists = true;
    item.isFile = true;
    item.isDirectory = false;
    item.queueDeleteFromDisk = false;

    results.changedContent = item.fileText !== content;
    results.queuedWrite = false;

    item.fileText = content;

    if (opts && opts.useCache === false) {
      item.useCache = false;
    }

    if (opts && opts.inMemoryOnly) {
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
    } else if (opts && opts.immediateWrite) {

      // If this is an immediate write then write the file
      // and do not add it to the queue
      await this.disk.writeFile(filePath, item.fileText);
    } else {
      // we want to write this to disk (eventually)
      // but only if the content is different
      // from our existing cached content
      if (!item.queueWriteToDisk && results.changedContent) {
        // not already queued to be written
        // and the content is different
        item.queueWriteToDisk = true;
        results.queuedWrite = true;
      }
    }


    return results;
  }

  writeFiles(files: { [filePath: string]: string }, opts?: d.FsWriteOptions) {
    return Promise.all(Object.keys(files).map(filePath => {
      return this.writeFile(filePath, files[filePath], opts);
    }));
  }

  async commit() {
    const instructions = getCommitInstructions(this.sys.path, this.items);

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
      const item = this.getItem(dirPath);

      if (item.exists && item.isDirectory) {
        // already cached that this path is indeed an existing directory
        continue;
      }

      try {
        // cache that we know this is a directory on disk
        item.exists = true;
        item.isDirectory = true;
        item.isFile = false;

        await this.disk.mkdir(dirPath);
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
      return this.commitWriteFile(filePath);
    }));
  }

  private async commitWriteFile(filePath: string) {
    const item = this.getItem(filePath);

    if (item.fileText == null) {
      throw new Error(`unable to find item fileText to write: ${filePath}`);
    }

    await this.disk.writeFile(filePath, item.fileText);

    if (item.useCache === false) {
      this.clearFileCache(filePath);
    }

    return filePath;
  }

  private commitDeleteFiles(filesToDelete: string[]) {
    return Promise.all(filesToDelete.map(async filePath => {
      if (typeof filePath !== 'string') {
        throw new Error(`unable to unlink without filePath`);
      }
      await this.disk.unlink(filePath);
      return filePath;
    }));
  }

  private async commitDeleteDirs(dirsToDelete: string[]) {
    const dirsDeleted: string[] = [];

    for (const dirPath of dirsToDelete) {
      try {
        await this.disk.rmdir(dirPath);
      } catch (e) {}
      dirsDeleted.push(dirPath);
    }

    return dirsDeleted;
  }

  clearDirCache(dirPath: string) {
    dirPath = normalizePath(dirPath);

    const filePaths = Object.keys(this.items);

    filePaths.forEach(f => {
      const filePath = this.sys.path.relative(dirPath, f).split('/')[0];
      if (!filePath.startsWith('.') && !filePath.startsWith('/')) {
        this.clearFileCache(f);
      }
    });
  }

  clearFileCache(filePath: string) {
    filePath = normalizePath(filePath);
    const item = this.items[filePath];
    if (item && !item.queueWriteToDisk) {
      delete this.items[filePath];
    }
  }

  cancelDeleteFilesFromDisk(filePaths: string[]) {
    filePaths.forEach(filePath => {
      const item = this.getItem(filePath);
      if (item.isFile && item.queueDeleteFromDisk) {
        item.queueDeleteFromDisk = false;
      }
    });
  }

  cancelDeleteDirectoriesFromDisk(dirPaths: string[]) {
    dirPaths.forEach(dirPath => {
      const item = this.getItem(dirPath);
      if (item.queueDeleteFromDisk) {
        item.queueDeleteFromDisk = false;
      }
    });
  }

  getItem(itemPath: string): d.FsItem {
    itemPath = normalizePath(itemPath);
    const item = this.items[itemPath];
    if (item) {
      return item;
    }
    return this.items[itemPath] = {};
  }

  clearCache() {
    this.items = {};
  }

  get keys() {
    return Object.keys(this.items).sort();
  }

  getMemoryStats() {
    return `data length: ${Object.keys(this.items).length}`;
  }

}


export function getCommitInstructions(path: d.Path, d: d.FsItems) {
  const instructions = {
    filesToDelete: [] as string[],
    filesToWrite: [] as string[],
    dirsToDelete: [] as string[],
    dirsToEnsure: [] as string[]
  };

  Object.keys(d).forEach(itemPath => {
    const item = d[itemPath];

    if (item.queueWriteToDisk) {

      if (item.isFile) {
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

      } else if (item.isDirectory) {
        if (!instructions.dirsToEnsure.includes(itemPath)) {
          instructions.dirsToEnsure.push(itemPath);
        }

        const dirDeleteIndex = instructions.dirsToDelete.indexOf(itemPath);
        if (dirDeleteIndex > -1) {
          instructions.dirsToDelete.splice(dirDeleteIndex, 1);
        }
      }

    } else if (item.queueDeleteFromDisk) {
      if (item.isDirectory && !instructions.dirsToEnsure.includes(itemPath)) {
        instructions.dirsToDelete.push(itemPath);

      } else if (item.isFile && !instructions.filesToWrite.includes(itemPath)) {
        instructions.filesToDelete.push(itemPath);
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


export function isTextFile(filePath: string) {
  filePath = filePath.toLowerCase().trim();
  return TXT_EXT.some(ext => filePath.endsWith(ext));
}

const TXT_EXT = [
  '.ts', '.tsx', '.js', '.jsx', '.svg',
  '.html', '.txt', '.md', '.markdown', '.json',
  '.css', '.scss', '.sass', '.less', '.styl'
];


export function shouldIgnore(filePath: string) {
  filePath = filePath.trim().toLowerCase();
  return IGNORE.some(ignoreFile => filePath.endsWith(ignoreFile));
}

const IGNORE = [
  '.ds_store',
  '.gitignore',
  'desktop.ini',
  'thumbs.db'
];

// only cache if it's less than 5MB-ish (using .length as a rough guess)
// why 5MB? idk, seems like a good number for source text
// it's pretty darn large to cover almost ALL legitimate source files
// and anything larger is probably a REALLY large file and a rare case
// which we don't need to eat up memory for
const MAX_TEXT_CACHE = 5242880;
