import type {
  CompilerSystem,
  CompilerSystemMakeDirectoryResults,
  CompilerSystemRealpathResults,
  CompilerSystemUnlinkResults,
  CompilerSystemWriteFileResults,
  Logger,
  TranspileOnlyResults,
} from '../../declarations';
import { asyncGlob, nodeCopyTasks } from './node-copy-tasks';
import { cpus, freemem, platform, release, tmpdir, totalmem } from 'os';
import { createHash } from 'crypto';
import exit from 'exit';
import fs from 'graceful-fs';
import { NodeLazyRequire } from './node-lazy-require';
import { NodeResolveModule } from './node-resolve-module';
import { NodeWorkerController } from './node-worker-controller';
import { normalizePath, requireFunc, catchError } from '@utils';
import path from 'path';
import type TypeScript from 'typescript';

export function createNodeSys(c: { process: any; logger: Logger }) {
  const prcs: NodeJS.Process = c.process;
  const logger = c.logger;
  const destroys = new Set<() => Promise<void> | void>();
  const onInterruptsCallbacks: (() => void)[] = [];

  const sysCpus = cpus();
  const hardwareConcurrency = sysCpus.length;
  const osPlatform = platform();

  const sys: CompilerSystem = {
    name: 'node',
    version: prcs.versions.node,
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
    createWorkerController(maxConcurrentWorkers) {
      const forkModulePath = path.join(__dirname, 'worker.js');
      return new NodeWorkerController(logger, forkModulePath, maxConcurrentWorkers);
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
          logger.error(`node sys destroy: ${e}`);
        }
      });
      if (waits.length > 0) {
        await Promise.all(waits);
      }
      destroys.clear();
    },
    dynamicImport(p) {
      return Promise.resolve(requireFunc(p));
    },
    encodeToBase64(str) {
      return Buffer.from(str).toString('base64');
    },
    exit(exitCode) {
      exit(exitCode);
    },
    getCurrentDirectory() {
      return normalizePath(prcs.cwd());
    },
    getCompilerExecutingPath() {
      return path.join(__dirname, '..', '..', 'compiler', 'stencil.js');
    },
    getDevServerExecutingPath() {
      return path.join(__dirname, '..', '..', 'dev-server', 'index.js');
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
    nextTick(cb) {
      prcs.nextTick(cb);
    },
    normalizePath,
    onProcessInterrupt(cb) {
      onInterruptsCallbacks.push(cb);
    },
    platformPath: path,
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
    tmpdir() {
      return tmpdir();
    },
    async transpile(input, filePath, compilerOptions) {
      const results: TranspileOnlyResults = {
        diagnostics: [],
        output: input,
        sourceMap: null,
      };

      try {
        const ts: typeof TypeScript = require('typescript');
        const tsResults = ts.transpileModule(input, { fileName: filePath, compilerOptions });
        results.output = tsResults.outputText;
        results.sourceMap = tsResults.sourceMapText;
      } catch (e) {
        catchError(results.diagnostics, e);
      }

      return results;
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
    details: {
      cpuModel: sysCpus[0].model,
      freemem() {
        return freemem();
      },
      platform: osPlatform === 'darwin' || osPlatform === 'linux' ? osPlatform : osPlatform === 'win32' ? 'windows' : '',
      release: release(),
      totalmem: totalmem(),
    },
  };

  const nodeResolve = new NodeResolveModule();

  sys.lazyRequire = new NodeLazyRequire(nodeResolve, {
    '@types/jest': ['24.9.1', '25.2.3'],
    '@types/puppeteer': ['1.19.0', '2.0.1'],
    'jest': ['24.9.0', '26.0.1'],
    'jest-cli': ['24.9.0', '26.0.1'],
    'pixelmatch': ['4.0.2', '4.0.2'],
    'puppeteer': ['1.19.0', '2.1.1'],
    'puppeteer-core': ['1.19.0', '2.1.1'],
    'workbox-build': ['4.3.1', '4.3.1'],
  });

  return sys;
}
