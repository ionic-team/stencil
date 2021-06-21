import type {
  CompilerSystem,
  CompilerSystemCreateDirectoryResults,
  CompilerSystemRealpathResults,
  CompilerSystemRemoveFileResults,
  CompilerSystemWriteFileResults,
} from '../../declarations';
import { asyncGlob, nodeCopyTasks } from './node-copy-tasks';
import { buildEvents } from '../../compiler/events';
import { checkVersion } from './node-stencil-version-checker';
import { cpus, freemem, platform, release, tmpdir, totalmem } from 'os';
import { createHash } from 'crypto';
import exit from 'exit';
import fs from 'graceful-fs';
import { isFunction, isPromise, normalizePath } from '@utils';
import { NodeLazyRequire } from './node-lazy-require';
import { NodeResolveModule } from './node-resolve-module';
import { NodeWorkerController } from './node-worker-controller';
import path from 'path';
import type TypeScript from 'typescript';

export function createNodeSys(c: { process?: any } = {}) {
  const prcs: NodeJS.Process = c.process || global.process;
  const destroys = new Set<() => Promise<void> | void>();
  const onInterruptsCallbacks: (() => void)[] = [];

  const sysCpus = cpus();
  const hardwareConcurrency = sysCpus.length;
  const osPlatform = platform();

  const compilerExecutingPath = path.join(__dirname, '..', '..', 'compiler', 'stencil.js');
  const devServerExecutingPath = path.join(__dirname, '..', '..', 'dev-server', 'index.js');

  const runInterruptsCallbacks = () => {
    const promises: Promise<any>[] = [];
    let cb: () => any;
    while (isFunction((cb = onInterruptsCallbacks.pop()))) {
      try {
        const rtn = cb();
        if (isPromise(rtn)) {
          promises.push(rtn);
        }
      } catch (e) {}
    }
    if (promises.length > 0) {
      return Promise.all(promises);
    }
    return null;
  };

  const sys: CompilerSystem = {
    name: 'node',
    version: prcs.versions.node,
    access(p) {
      return new Promise(resolve => {
        fs.access(p, err => resolve(!err));
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
    applyPrerenderGlobalPatch(opts) {
      if (typeof global.fetch !== 'function') {
        const nodeFetch = require(path.join(__dirname, 'node-fetch.js'));

        global.fetch = (input: any, init: any) => {
          if (typeof input === 'string') {
            // fetch(url) w/ url string
            const urlStr = new URL(input, opts.devServerHostUrl).href;
            return nodeFetch.fetch(urlStr, init);
          } else {
            // fetch(Request) w/ request object
            input.url = new URL(input.url, opts.devServerHostUrl).href;
            return nodeFetch.fetch(input, init);
          }
        };

        global.Headers = nodeFetch.Headers;
        global.Request = nodeFetch.Request;
        global.Response = nodeFetch.Response;
        (global as any).FetchError = nodeFetch.FetchError;
      }

      opts.window.fetch = global.fetch;
      opts.window.Headers = global.Headers;
      opts.window.Request = global.Request;
      opts.window.Response = global.Response;
      opts.window.FetchError = (global as any).FetchError;
    },
    checkVersion,
    copyFile(src, dst) {
      return new Promise(resolve => {
        fs.copyFile(src, dst, err => {
          resolve(!err);
        });
      });
    },
    createDir(p, opts) {
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
    createDirSync(p, opts) {
      const results: CompilerSystemCreateDirectoryResults = {
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
    createWorkerController(maxConcurrentWorkers) {
      const forkModulePath = path.join(__dirname, 'worker.js');
      return new NodeWorkerController(forkModulePath, maxConcurrentWorkers);
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
      if (waits.length > 0) {
        await Promise.all(waits);
      }
      destroys.clear();
    },
    dynamicImport(p) {
      return Promise.resolve(require(p));
    },
    encodeToBase64(str) {
      return Buffer.from(str).toString('base64');
    },
    async ensureDependencies() {
      return {
        stencilPath: sys.getCompilerExecutingPath(),
        diagnostics: [],
      };
    },
    async ensureResources() {},
    exit: async exitCode => {
      await runInterruptsCallbacks();
      exit(exitCode);
    },
    getCurrentDirectory() {
      return normalizePath(prcs.cwd());
    },
    getCompilerExecutingPath() {
      return compilerExecutingPath;
    },
    getDevServerExecutingPath() {
      return devServerExecutingPath;
    },
    getEnvironmentVar(key) {
      return process.env[key];
    },
    getLocalModulePath() {
      return null;
    },
    getRemoteModuleUrl() {
      return null;
    },
    glob: asyncGlob,
    hardwareConcurrency,
    isSymbolicLink(p: string) {
      return new Promise<boolean>(resolve => {
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
      });
    },
    nextTick: prcs.nextTick,
    normalizePath,
    onProcessInterrupt: cb => {
      if (!onInterruptsCallbacks.includes(cb)) {
        onInterruptsCallbacks.push(cb);
      }
    },
    platformPath: path,
    readDir(p) {
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
    readDirSync(p) {
      try {
        return fs.readdirSync(p).map(f => {
          return normalizePath(path.join(p, f));
        });
      } catch (e) {}
      return [];
    },
    readFile(p: string, encoding?: string) {
      if (encoding === 'binary') {
        return new Promise<any>(resolve => {
          fs.readFile(p, (_, data) => {
            resolve(data);
          });
        });
      }
      return new Promise<string>(resolve => {
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
        fs.realpath(p, 'utf8', (e, data) => {
          resolve({
            path: data,
            error: e,
          });
        });
      });
    },
    realpathSync(p) {
      const results: CompilerSystemRealpathResults = {
        path: undefined,
        error: null,
      };
      try {
        results.path = fs.realpathSync(p, 'utf8');
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    rename(oldPath, newPath) {
      return new Promise(resolve => {
        fs.rename(oldPath, newPath, error => {
          resolve({
            oldPath,
            newPath,
            error,
            oldDirs: [],
            oldFiles: [],
            newDirs: [],
            newFiles: [],
            renamed: [],
            isFile: false,
            isDirectory: false,
          });
        });
      });
    },
    resolvePath(p) {
      return normalizePath(p);
    },
    removeDir(p, opts) {
      return new Promise(resolve => {
        const recursive = !!(opts && opts.recursive);
        if (recursive) {
          fs.rmdir(p, { recursive: true }, err => {
            resolve({
              basename: path.basename(p),
              dirname: path.dirname(p),
              path: p,
              removedDirs: [],
              removedFiles: [],
              error: err,
            });
          });
        } else {
          fs.rmdir(p, err => {
            resolve({
              basename: path.basename(p),
              dirname: path.dirname(p),
              path: p,
              removedDirs: [],
              removedFiles: [],
              error: err,
            });
          });
        }
      });
    },
    removeDirSync(p, opts) {
      try {
        const recursive = !!(opts && opts.recursive);
        if (recursive) {
          fs.rmdirSync(p, { recursive: true });
        } else {
          fs.rmdirSync(p);
        }
        return {
          basename: path.basename(p),
          dirname: path.dirname(p),
          path: p,
          removedDirs: [],
          removedFiles: [],
          error: null,
        };
      } catch (e) {
        return {
          basename: path.basename(p),
          dirname: path.dirname(p),
          path: p,
          removedDirs: [],
          removedFiles: [],
          error: e,
        };
      }
    },
    removeFile(p) {
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
    removeFileSync(p) {
      const results: CompilerSystemRemoveFileResults = {
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
    setupCompiler(c) {
      const ts: typeof TypeScript = c.ts;
      const tsSysWatchDirectory = ts.sys.watchDirectory;
      const tsSysWatchFile = ts.sys.watchFile;

      sys.watchTimeout = 80;

      sys.events = buildEvents();

      sys.watchDirectory = (p, callback, recursive) => {
        const tsFileWatcher = tsSysWatchDirectory(
          p,
          fileName => {
            callback(normalizePath(fileName), null);
          },
          recursive,
        );

        const close = () => {
          tsFileWatcher.close();
        };

        sys.addDestory(close);

        return {
          close() {
            sys.removeDestory(close);
            tsFileWatcher.close();
          },
        };
      };

      sys.watchFile = (p, callback) => {
        const tsFileWatcher = tsSysWatchFile(p, (fileName, tsEventKind) => {
          fileName = normalizePath(fileName);
          if (tsEventKind === ts.FileWatcherEventKind.Created) {
            callback(fileName, 'fileAdd');
            sys.events.emit('fileAdd', fileName);
          } else if (tsEventKind === ts.FileWatcherEventKind.Changed) {
            callback(fileName, 'fileUpdate');
            sys.events.emit('fileUpdate', fileName);
          } else if (tsEventKind === ts.FileWatcherEventKind.Deleted) {
            callback(fileName, 'fileDelete');
            sys.events.emit('fileDelete', fileName);
          }
        });

        const close = () => {
          tsFileWatcher.close();
        };
        sys.addDestory(close);

        return {
          close() {
            sys.removeDestory(close);
            tsFileWatcher.close();
          },
        };
      };
    },
    stat(p) {
      return new Promise(resolve => {
        fs.stat(p, (err, fsStat) => {
          if (err) {
            resolve({
              isDirectory: false,
              isFile: false,
              isSymbolicLink: false,
              size: 0,
              mtimeMs: 0,
              error: err,
            });
          } else {
            resolve({
              isDirectory: fsStat.isDirectory(),
              isFile: fsStat.isFile(),
              isSymbolicLink: fsStat.isSymbolicLink(),
              size: fsStat.size,
              mtimeMs: fsStat.mtimeMs,
              error: null,
            });
          }
        });
      });
    },
    statSync(p) {
      try {
        const fsStat = fs.statSync(p);
        return {
          isDirectory: fsStat.isDirectory(),
          isFile: fsStat.isFile(),
          isSymbolicLink: fsStat.isSymbolicLink(),
          size: fsStat.size,
          mtimeMs: fsStat.mtimeMs,
          error: null,
        };
      } catch (e) {
        return {
          isDirectory: false,
          isFile: false,
          isSymbolicLink: false,
          size: 0,
          mtimeMs: 0,
          error: e,
        };
      }
    },
    tmpDirSync() {
      return tmpdir();
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
    generateFileHash(filePath, length) {
      return new Promise((resolve, reject) => {
        const h = createHash('sha1');
        fs.createReadStream(filePath)
          .on('error', err => reject(err))
          .on('data', data => h.update(data))
          .on('end', () => {
            let hash = h.digest('hex').toLowerCase();
            if (typeof length === 'number') {
              hash = hash.substr(0, length);
            }
            resolve(hash);
          });
      });
    },
    copy: nodeCopyTasks,
    details: {
      cpuModel: (Array.isArray(sysCpus) && sysCpus.length > 0 ? sysCpus[0] && sysCpus[0].model : '') || '',
      freemem() {
        return freemem();
      },
      platform:
        osPlatform === 'darwin' || osPlatform === 'linux' ? osPlatform : osPlatform === 'win32' ? 'windows' : '',
      release: release(),
      totalmem: totalmem(),
    },
  };

  const nodeResolve = new NodeResolveModule();

  sys.lazyRequire = new NodeLazyRequire(nodeResolve, {
    // [minimumVersion, recommendedVersion]
    '@types/jest': ['24.9.1', '26.0.21'],
    'jest': ['24.9.0', '26.6.3'],
    'jest-cli': ['24.9.0', '26.6.3'],
    'pixelmatch': ['4.0.2', '4.0.2'],
    'puppeteer': ['1.19.0', '10.0.0'],
    'puppeteer-core': ['1.19.0', '5.2.1'],
    'workbox-build': ['4.3.1', '4.3.1'],
  });

  prcs.on('SIGINT', runInterruptsCallbacks);
  prcs.on('exit', runInterruptsCallbacks);

  return sys;
}
