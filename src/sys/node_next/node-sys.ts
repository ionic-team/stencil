import { CompilerSystem, SystemDetails } from '../../declarations';
import { nodeCopyTasks, asyncGlob } from './node-copy-tasks';
import { createHash } from 'crypto';
import { normalizePath } from '@utils';
import fs from 'graceful-fs';
import path from 'path';
import { cpus, freemem, platform, release, tmpdir, totalmem } from 'os';


export function createNodeSys(prcs: NodeJS.Process) {
  const destroys = new Set<() => Promise<void> | void>();

  const sys: CompilerSystem = {
    access(p) {
      return new Promise(resolve => {
        fs.access(p, err => {
          const hasAccess = !err;
          resolve(hasAccess);
        });
      });
    },
    accessSync(p) {
      let hasAccess = false;
      try {
        fs.accessSync(p);
        hasAccess = true;
      } catch (e) {}
      return hasAccess;
    },
    addDestory(cb) {
      destroys.add(cb);
    },
    removeDestory(cb) {
      destroys.delete(cb);
    },
    copyFile(src, dst) {
      return new Promise(resolve => {
        fs.copyFile(src, dst, err => {
          resolve(!err);
        });
      });
    },
    async destroy() {
      const waits: Promise<void>[] = [];
      destroys.forEach(cb => {
        try {
          const rtn = cb();
          if (rtn && rtn.then) {
            waits.push(rtn);
          }
        } catch (e) {
          console.error(`node sys destroy: ${e}`);
        }
      });
      await Promise.all(waits);
      destroys.clear();
    },
    encodeToBase64(str) {
      return Buffer.from(str).toString('base64');
    },
    getCurrentDirectory() {
      return normalizePath(prcs.cwd());
    },
    glob: asyncGlob,
    isSymbolicLink: (p: string) => new Promise<boolean>(resolve => {
      try {
        fs.lstat(p, (err, stats) => {
          if (err) {
            resolve(false);
          } else {
            resolve(stats.isSymbolicLink());
          }
        });
      } catch (e) {
        resolve(false);
      }
    }),
    getCompilerExecutingPath: null,
    mkdir(p, opts) {
      return new Promise(resolve => {
        if (opts) {
          fs.mkdir(p, opts, err => {
            resolve(!err);
          });
        } else {
          fs.mkdir(p, err => {
            resolve(!err);
          });
        }
      });
    },
    mkdirSync(p, opts) {
      try {
        fs.mkdirSync(p, opts);
        return true;
      } catch (e) {}
      return false;
    },
    readdir(p) {
      return new Promise(resolve => {
        fs.readdir(p, (err, files) => {
          if (err) {
            resolve([]);
          } else {
            resolve(files.map(f => {
              return normalizePath(path.join(p, f));
            }));
          }
        });
      });
    },
    readdirSync(p) {
      try {
        return fs.readdirSync(p).map(f => {
          return normalizePath(path.join(p, f));
        });
      } catch (e) {}
      return [];
    },
    readFile(p) {
      return new Promise(resolve => {
        fs.readFile(p, 'utf8', (_, data) => {
          resolve(data);
        });
      });
    },
    readFileSync(p) {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch (e) {}
      return undefined;
    },
    realpath(p) {
      return new Promise(resolve => {
        fs.realpath(p, 'utf8', (_, data) => {
          resolve(data);
        });
      });
    },
    realpathSync(p) {
      try {
        return fs.realpathSync(p, 'utf8');
      } catch (e) {}
      return undefined;
    },
    resolvePath(p) {
      return normalizePath(p);
    },
    rmdir(p) {
      return new Promise(resolve => {
        fs.rmdir(p, err => {
          resolve(!err);
        });
      });
    },
    rmdirSync(p) {
      try {
        fs.rmdirSync(p);
        return true;
      } catch (e) {}
      return false;
    },
    stat(p) {
      return new Promise(resolve => {
        fs.stat(p, (err, s) => {
          if (err) {
            resolve(undefined);
          } else {
            resolve(s);
          }
        });
      });
    },
    statSync(p) {
      try {
        return fs.statSync(p);
      } catch (e) {}
      return undefined;
    },
    unlink(p) {
      return new Promise(resolve => {
        fs.unlink(p, err => {
          resolve(!err);
        });
      });
    },
    unlinkSync(p) {
      try {
        fs.unlinkSync(p);
        return true;
      } catch (e) {}
      return false;
    },
    writeFile(p, content) {
      return new Promise(resolve => {
        fs.writeFile(p, content, err => {
          resolve(!err);
        });
      });
    },
    writeFileSync(p, content) {
      try {
        fs.writeFileSync(p, content);
        return true;
      } catch (e) {}
      return false;
    },
    generateContentHash(content, length) {
      let hash = createHash('sha1')
        .update(content)
        .digest('hex')
        .toLowerCase();

      if (typeof length === 'number') {
        hash = hash.substr(0, length);
      }
      return Promise.resolve(hash);
    },
    copy: nodeCopyTasks,
    details: getDetails()
  };
  return sys;
}

const getDetails = () => {
  const details: SystemDetails = {
    cpuModel: '',
    cpus: -1,
    freemem() {
      return freemem();
    },
    platform: '',
    release: '',
    runtime: 'node',
    runtimeVersion: '',
    tmpDir: tmpdir(),
    totalmem: -1
  };
  try {
    const sysCpus = cpus();
    details.cpuModel = sysCpus[0].model;
    details.cpus = sysCpus.length;
    details.platform = platform();
    details.release = release();
    details.runtimeVersion = process.version;
    details.totalmem = totalmem();
  } catch (e) {}
  return details;
};
