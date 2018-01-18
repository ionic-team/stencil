import { FileSystem } from '../util/interfaces';
import { normalizePath } from '../compiler/util';
import * as path from 'path';


export class TestingFs implements FileSystem {
  data: {[filePath: string]: { isFile: boolean; isDirectory: boolean; content?: string; } } = {};

  diskWrites = 0;
  diskReads = 0;

  async copyFile(srcPath: string, destPath: string) {
    this.diskReads++;

    if (!this.data[srcPath]) {
      throw new Error(`copyFile, srcPath doesn't exists: ${srcPath}`);
    }

    this.diskWrites++;
    this.data[destPath] = this.data[srcPath];
  }

  async mkdir(dirPath: string) {
    dirPath = normalizePath(dirPath);
    this.diskWrites++;

    if (this.data[dirPath]) {
      throw new Error(`mkdir, dir already exists: ${dirPath}`);
    }

    this.data[dirPath] = {
      isDirectory: true,
      isFile: false
    };
  }

  async readdir(dirPath: string) {
    dirPath = normalizePath(dirPath);
    this.diskReads++;

    if (!this.data[dirPath]) {
      throw new Error(`readdir, dir doesn't exists: ${dirPath}`);
    }

    const filePaths = Object.keys(this.data);
    const dirs: string[] = [];

    filePaths.forEach(f => {
      const dirItem = path.relative(dirPath, f).split('/')[0];
      if (!dirItem.startsWith('.') && !dirItem.startsWith('/')) {
        if (dirItem !== '' && !dirs.includes(dirItem)) {
          dirs.push(dirItem);
        }
      }
    });

    return dirs.sort();
  }

  async readFile(filePath: string) {
    return this.readFileSync(filePath);
  }

  readFileSync(filePath: string) {
    filePath = normalizePath(filePath);
    this.diskReads++;
    if (this.data[filePath] && typeof this.data[filePath].content === 'string') {
      return this.data[filePath].content;
    }
    throw new Error(`readFile, path doesn't exist: ${filePath}`);
  }

  async rmdir(dirPath: string) {
    dirPath = normalizePath(dirPath);

    if (!this.data[dirPath]) {
      throw new Error(`rmdir, dir doesn't exists: ${dirPath}`);
    }

    Object.keys(this.data).forEach(item => {
      if (item.startsWith(dirPath + '/') || item === dirPath) {
        this.diskWrites++;
        delete this.data[item];
      }
    });
  }

  async stat(itemPath: string) {
    return this.statSync(itemPath);
  }

  statSync(itemPath: string) {
    itemPath = normalizePath(itemPath);
    this.diskReads++;
    if (this.data[itemPath]) {
      const isDirectory = this.data[itemPath].isDirectory;
      const isFile = this.data[itemPath].isFile;
      return  {
        isDirectory: () => isDirectory,
        isFile: () => isFile
      };
    }
    throw new Error(`stat, path doesn't exist: ${itemPath}`);
  }

  async unlink(filePath: string) {
    filePath = normalizePath(filePath);
    this.diskWrites++;

    if (!this.data[filePath]) {
      throw new Error(`unlink, file doesn't exists: ${filePath}`);
    }

    delete this.data[filePath];
  }

  async writeFile(filePath: string, content: string) {
    return this.writeFileSync(filePath, content);
  }

  writeFileSync(filePath: string, content: string) {
    this.diskWrites++;
    this.data[filePath] = {
      isDirectory: false,
      isFile: true,
      content: content
    };
  }
}
