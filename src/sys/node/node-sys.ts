import { CompilerSystem, SystemDetails, CompilerSystemUnlinkResults, CompilerSystemMakeDirectoryResults, CompilerSystemWriteFileResults } from '../../declarations';
import { asyncGlob, nodeCopyTasks } from './node-copy-tasks';
import { cpus, freemem, platform, release, tmpdir, totalmem } from 'os';
import { createHash } from 'crypto';
import fs from 'graceful-fs';
import { normalizePath } from '@utils';
import path from 'path';
import { NodeLazyRequire } from './node-lazy-require';
import { NodeResolveModule } from './node-resolve-module';

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
    isSymbolicLink: (p: string) =>
      new Promise<boolean>(resolve => {
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
    normalizePath,
    mkdir(p, opts) {
      return new Promise(resolve => {
        if (opts) {
          fs.mkdir(p, opts, err => {
            resolve({
              basename: path.basename(p),
              dirname: path.dirname(p),
              path: p,
              newDirs: [],
              error: err,
            });
          });
        } else {
          fs.mkdir(p, err => {
            resolve({
              basename: path.basename(p),
              dirname: path.dirname(p),
              path: p,
              newDirs: [],
              error: err,
            });
          });
        }
      });
    },
    mkdirSync(p, opts) {
      const results: CompilerSystemMakeDirectoryResults = {
        basename: path.basename(p),
        dirname: path.dirname(p),
        path: p,
        newDirs: [],
        error: null,
      };
      try {
        fs.mkdirSync(p, opts);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    readdir(p) {
      return new Promise(resolve => {
        fs.readdir(p, (err, files) => {
          if (err) {
            resolve([]);
          } else {
            resolve(
              files.map(f => {
                return normalizePath(path.join(p, f));
              }),
            );
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
    rename(oldPath, newPath) {
      return new Promise(resolve => {
        fs.rename(oldPath, newPath, error => {
          resolve({ oldPath, newPath, error, oldDirs: [], oldFiles: [], newDirs: [], newFiles: [], renamed: [], isFile: false, isDirectory: false });
        });
      });
    },
    resolvePath(p) {
      return normalizePath(p);
    },
    rmdir(p, opts) {
      return new Promise(resolve => {
        const recursive = !!(opts && opts.recursive);
        if (recursive) {
          fs.rmdir(p, { recursive: true }, err => {
            resolve({ basename: path.basename(p), dirname: path.dirname(p), path: p, removedDirs: [], removedFiles: [], error: err });
          });
        } else {
          fs.rmdir(p, err => {
            resolve({ basename: path.basename(p), dirname: path.dirname(p), path: p, removedDirs: [], removedFiles: [], error: err });
          });
        }
      });
    },
    rmdirSync(p, opts) {
      try {
        const recursive = !!(opts && opts.recursive);
        if (recursive) {
          fs.rmdirSync(p, { recursive: true });
        } else {
          fs.rmdirSync(p);
        }
        return { basename: path.basename(p), dirname: path.dirname(p), path: p, removedDirs: [], removedFiles: [], error: null };
      } catch (e) {
        return { basename: path.basename(p), dirname: path.dirname(p), path: p, removedDirs: [], removedFiles: [], error: e };
      }
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
          resolve({
            basename: path.basename(p),
            dirname: path.dirname(p),
            path: p,
            error: err,
          });
        });
      });
    },
    unlinkSync(p) {
      const results: CompilerSystemUnlinkResults = {
        basename: path.basename(p),
        dirname: path.dirname(p),
        path: p,
        error: null,
      };
      try {
        fs.unlinkSync(p);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    writeFile(p, content) {
      return new Promise(resolve => {
        fs.writeFile(p, content, err => {
          resolve({ path: p, error: err });
        });
      });
    },
    writeFileSync(p, content) {
      const results: CompilerSystemWriteFileResults = {
        path: p,
        error: null,
      };
      try {
        fs.writeFileSync(p, content);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    generateContentHash(content, length) {
      let hash = createHash('sha1').update(content).digest('hex').toLowerCase();

      if (typeof length === 'number') {
        hash = hash.substr(0, length);
      }
      return Promise.resolve(hash);
    },
    copy: nodeCopyTasks,
    details: getDetails(),
  };

  const nodeResolve = new NodeResolveModule();

  sys.lazyRequire = new NodeLazyRequire(nodeResolve, {
    '@types/jest': ['24.9.1', '24.9.1'],
    '@types/puppeteer': ['1.19.0', '2.0.1'],
    'jest': ['24.9.0', '24.9.0'],
    'jest-cli': ['24.9.0', '24.9.0'],
    'pixelmatch': ['4.0.2', '4.0.2'],
    'puppeteer': ['1.19.0', '2.1.1'],
    'puppeteer-core': ['1.19.0', '2.1.1'],
    'workbox-build': ['4.3.1', '4.3.1'],
  });

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
    totalmem: -1,
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
