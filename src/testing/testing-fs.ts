import * as d from '../declarations';
import { normalizePath } from '@utils';
import fs from 'fs';
import path from 'path';


export class TestingFs implements d.FileSystem {
  data = new Map<string, Data>();

  diskWrites = 0;
  diskReads = 0;

  access(itemPath: string) {
    return new Promise<void>((resolve, reject) => {
      process.nextTick(() => {
        try {
          this.statSync(itemPath);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  copyFile(srcPath: string, destPath: string) {
    srcPath = normalizePath(srcPath);
    destPath = normalizePath(destPath);

    return new Promise<void>((resolve, reject) => {
      process.nextTick(() => {
        this.diskReads++;
        const data = this.data.get(srcPath);
        if (data == null) {
          reject(`copyFile, srcPath doesn't exists: ${srcPath}`);

        } else {
          this.diskWrites++;
          this.data.set(destPath, data);
          resolve();
        }
      });
    });
  }

  existsSync(filePath: string) {
    return this.data.has(normalizePath(filePath));
  }

  createReadStream(_filePath: string): any {
    return {};
  }

  mkdir(dirPath: string) {
    return new Promise<void>((resolve, reject) => {
      process.nextTick(() => {
        dirPath = normalizePath(dirPath);
        this.diskWrites++;

        if (this.data.has(dirPath)) {
          reject(`mkdir, dir already exists: ${dirPath}`);
        } else {
          this.data.set(dirPath, {
            isDirectory: true,
            isFile: false
          });
          resolve();
        }
      });
    });
  }

  mkdirSync(dirPath: string) {
    dirPath = normalizePath(dirPath);
    this.diskWrites++;

    if (this.data.has(dirPath)) {
      throw new Error(`mkdir, dir already exists: ${dirPath}`);
    } else {
      this.data.set(dirPath, {
        isDirectory: true,
        isFile: false
      });
    }
  }

  readdir(dirPath: string) {
    dirPath = normalizePath(dirPath);
    return new Promise<string[]>((resolve, reject) => {
      process.nextTick(() => {
        try {
          const dirs = this.readdirSync(dirPath);
          resolve(dirs.sort());

        } catch (e) {
          reject(e);
        }
      });
    });
  }

  readdirSync(dirPath: string) {
    dirPath = normalizePath(dirPath);
    this.diskReads++;

    if (!this.data.has(dirPath)) {
      throw new Error(`readdir, dir doesn't exists: ${dirPath}`);
    }

    const dirs: string[] = [];

    this.data.forEach((_, key) => {
      const pathRelative = path.relative(dirPath, key);
      // Windows: pathRelative =  ..\dir2\dir3\dir4\file2.js
      const dirItem = normalizePath(pathRelative).split('/')[0];

      if (!dirItem.startsWith('.') && !dirItem.startsWith('/')) {
        if (dirItem !== '' && !dirs.includes(dirItem)) {
          dirs.push(dirItem);
        }
      }
    });

    return dirs;
  }

  readFile(filePath: string) {
    return new Promise<string>((resolve, reject) => {
      process.nextTick(() => {
        try {
          filePath = normalizePath(filePath);
          resolve(this.readFileSync(filePath));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  readFileSync(filePath: string) {
    filePath = normalizePath(filePath);
    this.diskReads++;
    const data = this.data.get(filePath);

    if (data != null && typeof data.content === 'string') {
      return data.content;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    this.data.set(filePath, {
      isFile: true,
      isDirectory: false,
      content: content
    });

    return content;
  }

  rmdir(dirPath: string) {
    return new Promise<void>((resolve, reject) => {
      process.nextTick(() => {
        dirPath = normalizePath(dirPath);

        if (!this.data.has(dirPath)) {
          reject(`rmdir, dir doesn't exists: ${dirPath}`);
        } else {
          this.data.forEach((_, key) => {
            if (key.startsWith(dirPath + '/') || key === dirPath) {
              this.diskWrites++;
              this.data.delete(key);
            }
          });
          resolve();
        }
      });
    });
  }

  stat(itemPath: string) {
    return new Promise<d.FsStats>((resolve, reject) => {
      process.nextTick(() => {
        try {
          resolve(this.statSync(itemPath));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  statSync(itemPath: string) {
    itemPath = normalizePath(itemPath);
    this.diskReads++;
    const data = this.data.get(itemPath);

    if (data != null) {
      const isDirectory = data.isDirectory;
      const isFile = data.isFile;
      return  {
        isDirectory: () => isDirectory,
        isFile: () => isFile,
        size: data.content != null ? data.content.length : 0
      } as d.FsStats;
    }
    throw new Error(`stat, path doesn't exist: ${itemPath}`);
  }

  unlink(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      process.nextTick(() => {
        filePath = normalizePath(filePath);
        this.diskWrites++;

        if (!this.data.has(filePath)) {
          reject(`unlink, file doesn't exists: ${filePath}`);
        } else {
          this.data.delete(filePath);
          resolve();
        }
      });
    });
  }

  writeFile(filePath: string, content: string) {
    return new Promise<void>(resolve => {
      process.nextTick(() => {
        filePath = normalizePath(filePath);
        this.diskWrites++;
        this.data.set(filePath, {
          isDirectory: false,
          isFile: true,
          content: content
        });
        resolve();
      });
    });
  }

  writeFileSync(filePath: string, content: string) {
    filePath = normalizePath(filePath);
    this.diskWrites++;
    this.data.set(filePath, {
      isDirectory: false,
      isFile: true,
      content: content
    });
  }

  writeFiles(files: { [filePath: string]: string }) {
    return Promise.all(Object.keys(files).map(filePath => {
      return this.writeFile(filePath, files[filePath]);
    }));
  }

}

interface Data {
  isFile: boolean;
  isDirectory: boolean;
  content?: string;
}
