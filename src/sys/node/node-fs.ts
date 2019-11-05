import * as d from '../../declarations';
import fs from 'graceful-fs';
import mkdirp from 'mkdirp';


export class NodeFs implements d.FileSystem {
  supportsMkdirRecursive = false;
  supportsCOPYFILE_FICLONE = false;

  constructor(process: NodeJS.Process) {
    try {
      const segments = process.version.split('.').map(v => parseInt(v, 10));
      const major = segments[0];
      const minor = segments[1];

      // mkdir recursive support started in v10.12.0
      this.supportsMkdirRecursive = (major >= 11 || (major === 10 && minor >= 12));
      this.supportsCOPYFILE_FICLONE = (major >= 12);
    } catch (e) {}
  }

  access(path: string) {
    return new Promise<void>((resolve, reject) => {
      fs.access(path, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  copyFile(src: string, dest: string) {
    return new Promise<void>((resolve, reject) => {
      const flags = this.supportsCOPYFILE_FICLONE
        ? fs.constants.COPYFILE_FICLONE
        : 0;

      return fs.copyFile(src, dest, flags, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  createReadStream(filePath: string) {
    return fs.createReadStream(filePath);
  }

  mkdir(dirPath: string, opts: d.MakeDirectoryOptions = {}) {
    if (opts.recursive) {
      if (this.supportsMkdirRecursive) {
        // supports mkdir recursive
        return new Promise<void>((resolve, reject) => {
          fs.mkdir(dirPath, opts, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

      } else {
        // does NOT support mkdir recursive
        // use good ol' mkdirp
        return new Promise<void>((resolve, reject) => {
          mkdirp(dirPath, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    }

    // not doing recursive
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(dirPath, opts, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  mkdirSync(dirPath: string, opts: fs.MakeDirectoryOptions = {}) {
    if (opts.recursive) {
      if (this.supportsMkdirRecursive) {
        // supports mkdir recursive
        fs.mkdirSync(dirPath, opts);

      } else {
        // does NOT support mkdir recursive
        // use good ol' mkdirp
        mkdirp.sync(dirPath, opts);
      }

    } else {
      // not doing recursive
      fs.mkdirSync(dirPath, opts);
    }
  }

  readdir(dirPath: string) {
    return new Promise<string[]>((resolve, reject) => {
      fs.readdir(dirPath, (err: any, files: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  readdirSync(dirPath: string) {
    return fs.readdirSync(dirPath);
  }

  readFile(filePath: string, format = 'utf8') {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, format, (err: any, content: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }

  exists(filePath: string) {
    return new Promise<boolean>(resolve => {
      fs.exists(filePath, resolve);
    });
  }

  existsSync(filePath: string) {
    return fs.existsSync(filePath);
  }

  readFileSync(filePath: string, format = 'utf8') {
    return fs.readFileSync(filePath, format);
  }

  rmdir(dirPath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.rmdir(dirPath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  stat(itemPath: string) {
    return new Promise<d.FsStats>((resolve, reject) => {
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });
  }

  statSync(itemPath: string): d.FsStats {
    return fs.statSync(itemPath);
  }

  unlink(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(filePath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  writeFile(filePath: string, content: string) {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, content, { encoding: 'utf8' }, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  writeFileSync(filePath: string, content: string) {
    return fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  }

}
