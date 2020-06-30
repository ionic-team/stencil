import type {
  CompilerFsStats,
  CompilerSystem,
  CompilerSystemMakeDirectoryResults,
  CompilerSystemRealpathResults,
  CompilerSystemRemoveDirectoryResults,
  CompilerSystemRenameResults,
  CompilerSystemUnlinkResults,
  CompilerSystemWriteFileResults,
  Logger,
  PackageJsonData,
  TranspileOnlyResults,
} from '../../declarations';
import { basename, delimiter, dirname, ensureDirSync, extname, isAbsolute, join, normalize, parse, relative, resolve, sep, win32, posix } from './deps';
import { createDenoWorkerMainController } from './deno-worker-main';
import { denoCopyTasks } from './deno-copy-tasks';
import { normalizePath, catchError } from '@utils';
import type { Deno as DenoTypes } from '../../../types/lib.deno';

export function createDenoSys(c: { Deno: any; logger: Logger }) {
  let tmpDir: string = null;
  const deno: typeof DenoTypes = c.Deno;
  const logger = c.logger;
  const destroys = new Set<() => Promise<void> | void>();
  const hardwareConcurrency = 4;

  const getLocalModulePath = (opts: { rootDir: string; moduleId: string; path: string }) => join(opts.rootDir, 'node_modules', opts.moduleId, opts.path);

  const getRemoteModuleUrl = (module: { moduleId: string; path: string; version?: string }) => {
    const npmBaseUrl = 'https://cdn.jsdelivr.net/npm/';
    const path = `${module.moduleId}${module.version ? '@' + module.version : ''}/${module.path}`;
    return new URL(path, npmBaseUrl).href;
  };

  const fetchAndWrite = async (opts: { url: string; filePath: string }) => {
    try {
      await deno.stat(opts.filePath);
      return;
    } catch (e) {}

    try {
      const rsp = await fetch(opts.url);
      if (rsp.ok) {
        ensureDirSync(dirname(opts.filePath));

        const content = await rsp.clone().text();
        const encoder = new TextEncoder();
        await deno.writeFile(opts.filePath, encoder.encode(content));
        c.logger.debug('fetch', opts.url, opts.filePath);
      } else {
        c.logger.warn('fetch', opts.url, rsp.status);
      }
    } catch (e) {
      c.logger.error(e);
    }
  };

  const sys: CompilerSystem = {
    name: 'deno',
    version: deno.version.deno,
    async access(p) {
      try {
        await deno.stat(p);
        return true;
      } catch (e) {
        return false;
      }
    },
    accessSync(p) {
      try {
        deno.statSync(p);
        return true;
      } catch (e) {
        return false;
      }
    },
    addDestory(cb) {
      destroys.add(cb);
    },
    removeDestory(cb) {
      destroys.delete(cb);
    },
    async copyFile(src, dst) {
      try {
        await deno.copyFile(src, dst);
        return true;
      } catch (e) {
        return false;
      }
    },
    createWorkerController: maxConcurrentWorkers => createDenoWorkerMainController(sys, logger, maxConcurrentWorkers),
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
    dynamicImport(p) {
      return import(p);
    },
    encodeToBase64(str) {
      return Buffer.from(str).toString('base64');
    },
    async ensureDependencies(opts) {
      const tsDep = opts.dependencies.find(dep => dep.name === 'typescript');

      try {
        const decoder = new TextDecoder('utf-8');
        const pkgContent = await deno.readFile(sys.getLocalModulePath({ rootDir: opts.rootDir, moduleId: tsDep.name, path: tsDep.main }));
        const pkgData: PackageJsonData = JSON.parse(decoder.decode(pkgContent));
        if (pkgData.version === tsDep.version) {
          return;
        }
      } catch (e) {}

      const timespace = logger.createTimeSpan(`ensureDependencies start`, true);

      const deps = tsDep.resources.map(p => ({
        url: sys.getRemoteModuleUrl({ moduleId: tsDep.name, version: tsDep.version, path: p }),
        filePath: sys.getLocalModulePath({ rootDir: opts.rootDir, moduleId: tsDep.name, path: p }),
      }));

      await Promise.all(deps.map(fetchAndWrite));

      timespace.finish(`ensureDependencies end`);
    },
    exit(exitCode) {
      deno.exit(exitCode);
    },
    hardwareConcurrency,
    getCompilerExecutingPath() {
      const current = new URL('../../compiler/stencil.js', import.meta.url);
      return normalizePath(current.pathname);
    },
    getCurrentDirectory() {
      return normalizePath(deno.cwd());
    },
    getEnvironmentVar(key) {
      return deno.env.get(key);
    },
    getLocalModulePath,
    getRemoteModuleUrl,
    glob(_pattern, _opts) {
      return null;
    },
    async isSymbolicLink(p) {
      try {
        const stat = await deno.stat(p);
        return stat.isSymlink;
      } catch (e) {
        return false;
      }
    },
    async mkdir(p, opts) {
      const results: CompilerSystemMakeDirectoryResults = {
        basename: basename(p),
        dirname: dirname(p),
        path: p,
        newDirs: [],
        error: null,
      };
      try {
        await deno.mkdir(p, opts);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    mkdirSync(p, opts) {
      const results: CompilerSystemMakeDirectoryResults = {
        basename: basename(p),
        dirname: dirname(p),
        path: p,
        newDirs: [],
        error: null,
      };
      try {
        deno.mkdirSync(p, opts);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    nextTick(cb) {
      // https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#queueMicrotask
      queueMicrotask(cb);
    },
    normalizePath,
    platformPath: {
      basename,
      dirname,
      extname,
      isAbsolute,
      join,
      normalize,
      parse,
      relative,
      resolve,
      sep,
      delimiter,
      posix,
      win32,
    },
    async readdir(p) {
      const dirEntries: string[] = [];
      try {
        for await (const dirEntry of deno.readDir(p)) {
          dirEntries.push(normalizePath(join(p, dirEntry.name)));
        }
      } catch (e) {}
      return dirEntries;
    },
    readdirSync(p) {
      const dirEntries: string[] = [];
      try {
        for (const dirEntry of deno.readDirSync(p)) {
          dirEntries.push(normalizePath(join(p, dirEntry.name)));
        }
      } catch (e) {}
      return dirEntries;
    },
    async readFile(p) {
      try {
        const decoder = new TextDecoder('utf-8');
        const data = await deno.readFile(p);
        return decoder.decode(data);
      } catch (e) {}
      return undefined;
    },
    readFileSync(p) {
      try {
        const decoder = new TextDecoder('utf-8');
        const data = deno.readFileSync(p);
        return decoder.decode(data);
      } catch (e) {}
      return undefined;
    },
    async realpath(p) {
      const results: CompilerSystemRealpathResults = {
        error: null,
        path: undefined,
      };
      try {
        results.path = await deno.realPath(p);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    realpathSync(p) {
      const results: CompilerSystemRealpathResults = {
        error: null,
        path: undefined,
      };
      try {
        results.path = deno.realPathSync(p);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    async rename(oldPath, newPath) {
      const results: CompilerSystemRenameResults = {
        oldPath,
        newPath,
        error: null,
        oldDirs: [],
        oldFiles: [],
        newDirs: [],
        newFiles: [],
        renamed: [],
        isFile: false,
        isDirectory: false,
      };
      try {
        await deno.rename(oldPath, newPath);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    resolvePath(p) {
      return normalizePath(p);
    },
    async rmdir(p, opts) {
      const results: CompilerSystemRemoveDirectoryResults = {
        basename: basename(p),
        dirname: dirname(p),
        path: p,
        removedDirs: [],
        removedFiles: [],
        error: null,
      };
      try {
        await deno.remove(p, opts);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    rmdirSync(p, opts) {
      const results: CompilerSystemRemoveDirectoryResults = {
        basename: basename(p),
        dirname: dirname(p),
        path: p,
        removedDirs: [],
        removedFiles: [],
        error: null,
      };
      try {
        deno.removeSync(p, opts);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    async stat(p) {
      try {
        // deno hangs when using `stat()`!?!?!
        // idk why compilerCtx.fs.emptyDirs(cleanDirs) will hang when stat is async
        const stat = deno.statSync(p);
        const results: CompilerFsStats = {
          isFile: () => stat.isFile,
          isDirectory: () => stat.isDirectory,
          isSymbolicLink: () => stat.isSymlink,
          size: stat.size,
        };
        return results;
      } catch (e) {}
      return undefined;
    },
    statSync(p) {
      try {
        const stat = deno.statSync(p);
        const results: CompilerFsStats = {
          isFile: () => stat.isFile,
          isDirectory: () => stat.isDirectory,
          isSymbolicLink: () => stat.isSymlink,
          size: stat.size,
        };
        return results;
      } catch (e) {}
      return undefined;
    },
    tmpdir() {
      if (tmpDir == null) {
        tmpDir = deno.makeTempDirSync();
      }
      return tmpDir;
    },
    async transpile(input, filePath, compilerOptions) {
      const results: TranspileOnlyResults = {
        diagnostics: [],
        output: input,
        sourceMap: null,
      };

      try {
        Object.assign(compilerOptions, {
          sourceMap: false,
          allowJs: true,
          declaration: false,
          target: 'es5',
          module: 'esnext',
          removeComments: false,
          isolatedModules: true,
          skipLibCheck: true,
          noLib: true,
          noResolve: true,
          suppressOutputPathCheck: true,
          allowNonTsExtensions: true,
          composite: false,
        });
        const [, emitted] = await (deno as any).compile(
          filePath,
          {
            [filePath]: input,
          },
          compilerOptions,
        );

        results.output = emitted[filePath.replace('.ts', '.js')];
      } catch (e) {
        catchError(results.diagnostics, e);
      }

      return results;
    },
    async unlink(p) {
      const results: CompilerSystemUnlinkResults = {
        basename: basename(p),
        dirname: dirname(p),
        path: p,
        error: null,
      };
      try {
        await deno.remove(p);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    unlinkSync(p) {
      const results: CompilerSystemUnlinkResults = {
        basename: basename(p),
        dirname: dirname(p),
        path: p,
        error: null,
      };
      try {
        deno.removeSync(p);
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    async writeFile(p, content) {
      const results: CompilerSystemWriteFileResults = {
        path: p,
        error: null,
      };
      try {
        const encoder = new TextEncoder();
        await deno.writeFile(p, encoder.encode(content));
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    writeFileSync(p, content) {
      const results: CompilerSystemWriteFileResults = {
        path: p,
        error: null,
      };
      try {
        const encoder = new TextEncoder();
        deno.writeFileSync(p, encoder.encode(content));
      } catch (e) {
        results.error = e;
      }
      return results;
    },
    watchDirectory(p, callback, recursive) {
      const fsWatcher = deno.watchFs(p, { recursive });

      const dirWatcher = async () => {
        try {
          for await (const fsEvent of fsWatcher) {
            for (const fsPath of fsEvent.paths) {
              const fileName = normalizePath(fsPath);

              if (fsEvent.kind === 'create') {
                callback(fileName, 'dirAdd');
                sys.events.emit('dirAdd', fileName);
              } else if (fsEvent.kind === 'modify') {
                callback(fileName, 'fileUpdate');
                sys.events.emit('fileUpdate', fileName);
              } else if (fsEvent.kind === 'remove') {
                callback(fileName, 'dirDelete');
                sys.events.emit('dirDelete', fileName);
              }
            }
          }
        } catch (e) {
          // todo
          // swallows "BadResource: Bad resource ID at unwrapResponse"??
        }
      };
      dirWatcher();

      const close = async () => {
        try {
          await fsWatcher.return();
        } catch (e) {
          // todo
          // swallows "BadResource: Bad resource ID at unwrapResponse"??
        }
      };
      sys.addDestory(close);

      return {
        close,
      };
    },
    watchFile(p, callback) {
      const fsWatcher = deno.watchFs(p, { recursive: false });

      const fileWatcher = async () => {
        try {
          for await (const fsEvent of fsWatcher) {
            for (const fsPath of fsEvent.paths) {
              const fileName = normalizePath(fsPath);

              if (fsEvent.kind === 'create') {
                callback(fileName, 'fileAdd');
                sys.events.emit('fileAdd', fileName);
              } else if (fsEvent.kind === 'modify') {
                callback(fileName, 'fileUpdate');
                sys.events.emit('fileUpdate', fileName);
              } else if (fsEvent.kind === 'remove') {
                callback(fileName, 'fileDelete');
                sys.events.emit('fileDelete', fileName);
              }
            }
          }
        } catch (e) {
          // todo
          // swallows "BadResource: Bad resource ID at unwrapResponse"??
        }
      };
      fileWatcher();

      const close = async () => {
        try {
          await fsWatcher.return();
        } catch (e) {
          // todo
          // swallows "BadResource: Bad resource ID at unwrapResponse"??
        }
      };
      sys.addDestory(close);

      return {
        close,
      };
    },
    async generateContentHash(content) {
      // https://github.com/denoland/deno/issues/1891
      // https://jsperf.com/hashcodelordvlad/121
      const len = content.length;
      if (len === 0) return '';
      let hash = 0;
      for (let i = 0; i < len; i++) {
        hash = (hash << 5) - hash + content.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      if (hash < 0) {
        hash = hash * -1;
      }
      return hash + '';
    },
    copy: (copyTasks, srcDir) => denoCopyTasks(deno, copyTasks, srcDir),
    details: {
      // https://github.com/denoland/deno/issues/3802
      cpuModel: 'cpu-model',
      freemem: () => 0,
      platform: deno.build.os,
      release: deno.build.vendor,
      totalmem: 0,
    },
    applyGlobalPatch: async fromDir => {
      const { applyNodeCompat } = await import('@deno-node-compat');
      applyNodeCompat({ fromDir });
    },
  };

  return sys;
}
