import * as d from '../../declarations';
import { BrowserLogger } from './browser-logger';
import { BrowserSystem } from './browser-sys';
import { Compiler } from '../../compiler';
import { normalizePath } from '@utils';
import path from 'path';


class BrowserCompiler extends Compiler {

  constructor(config: d.BrowserConfig) {
    if (config.window == null) {
      config.window = window;
    }

    if (config.fs == null) {
      throw new Error(`missing config.fs (mocked file system)`);
    }

    config.enableCache = false;
    config.validateTypes = false;

    const sys = new BrowserSystem(config);
    config.sys = sys;

    if (config.logger == null) {
      config.logger = new BrowserLogger(config.window);
    }

    if (typeof (config as d.Config).rootDir !== 'string') {
      (config as d.Config).rootDir = '/';
    }

    super(config);
  }

}


class BrowserFs implements d.FileSystem {
  private data = new Map<string, Data>();

  access(itemPath: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.statSync(itemPath);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  copyFile(srcPath: string, destPath: string) {
    srcPath = normalizePath(srcPath);
    destPath = normalizePath(destPath);

    return new Promise<void>((resolve, reject) => {
      const data = this.data.get(srcPath);
      if (data == null) {
        reject(`copyFile, srcPath doesn't exists: ${srcPath}`);

      } else {
        this.data.set(destPath, data);
        resolve();
      }
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
      dirPath = normalizePath(dirPath);

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
  }

  mkdirSync(dirPath: string) {
    dirPath = normalizePath(dirPath);

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
      try {
        const dirs = this.readdirSync(dirPath);
        resolve(dirs.sort());

      } catch (e) {
        reject(e);
      }
    });
  }

  readdirSync(dirPath: string) {
    dirPath = normalizePath(dirPath);

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
      try {
        filePath = normalizePath(filePath);
        resolve(this.readFileSync(filePath));
      } catch (e) {
        reject(e);
      }
    });
  }

  readFileSync(filePath: string) {
    filePath = normalizePath(filePath);
    const data = this.data.get(filePath);

    if (data != null && typeof data.content === 'string') {
      return data.content;
    }

    throw new Error(`unable to read ${filePath}`);
  }

  rmdir(dirPath: string) {
    return new Promise<void>((resolve, reject) => {
      dirPath = normalizePath(dirPath);

      if (!this.data.has(dirPath)) {
        reject(`rmdir, dir doesn't exists: ${dirPath}`);

      } else {
        this.data.forEach((_, key) => {
          if (key.startsWith(dirPath + '/') || key === dirPath) {
            this.data.delete(key);
          }
        });
        resolve();
      }
    });
  }

  stat(itemPath: string) {
    return new Promise<d.FsStats>((resolve, reject) => {
      try {
        resolve(this.statSync(itemPath));
      } catch (e) {
        reject(e);
      }
    });
  }

  statSync(itemPath: string) {
    itemPath = normalizePath(itemPath);
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
      filePath = normalizePath(filePath);

      if (!this.data.has(filePath)) {
        reject(`unlink, file doesn't exists: ${filePath}`);
      } else {
        this.data.delete(filePath);
        resolve();
      }
    });
  }

  writeFile(filePath: string, content: string) {
    return new Promise<void>(resolve => {
      filePath = normalizePath(filePath);
      this.data.set(filePath, {
        isDirectory: false,
        isFile: true,
        content: content
      });
      resolve();
    });
  }

  writeFileSync(filePath: string, content: string) {
    filePath = normalizePath(filePath);
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


export { BrowserCompiler as Compiler };
export { BrowserConfig as Config } from '../../declarations';
export { BrowserFs as Fs };
