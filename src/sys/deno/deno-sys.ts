import type {
  CompilerSystem,
  CompilerSystemCreateDirectoryResults,
  CompilerSystemRealpathResults,
  CompilerSystemRemoveDirectoryResults,
  CompilerSystemRemoveFileResults,
  CompilerSystemRenameResults,
  CompilerSystemWriteFileResults,
  Diagnostic,
} from '../../declarations';
import {
  basename,
  delimiter,
  dirname,
  extname,
  isAbsolute,
  join,
  normalize,
  parse,
  relative,
  resolve,
  sep,
  win32,
  posix,
} from './deps';
import { convertPathToFileProtocol, isRemoteUrl, normalizePath, catchError, buildError } from '@utils';
import { createDenoWorkerMainController } from './deno-worker-main';
import { denoCopyTasks } from './deno-copy-tasks';
import { version } from '../../version';
import type { Deno as DenoTypes } from '../../../types/lib.deno';

export function createDenoSys(c: { Deno?: any } = {}) {
  let tmpDir: string = null;
  let stencilBaseUrl: URL;
  let stencilRemoteUrl: string;
  let stencilExePath = new URL(`../../compiler/stencil.js`, import.meta.url).href;
  let typescriptRemoteUrl: string;
  let typescriptExePath: string;
  const deno: typeof DenoTypes = c.Deno || (globalThis as any).Deno;
  const destroys = new Set<() => Promise<void> | void>();
  const hardwareConcurrency = 0;
  const isRemoteHost = isRemoteUrl(import.meta.url);

  const getLocalModulePath = (opts: { rootDir: string; moduleId: string; path: string }) =>
    join(opts.rootDir, 'node_modules', opts.moduleId, opts.path);

  const getRemoteModuleUrl = (module: { moduleId: string; path: string; version?: string }) => {
    const npmBaseUrl = 'https://cdn.jsdelivr.net/npm/';
    const path = `${module.moduleId}${module.version ? '@' + module.version : ''}/${module.path}`;
    return new URL(path, npmBaseUrl).href;
  };

  const fetchWrite = async (diagnostics: Diagnostic[], remoteUrl: string, localPath: string) => {
    try {
      await deno.stat(localPath);
      return;
    } catch (e) {}

    try {
      const rsp = await fetch(remoteUrl);
      if (rsp.ok) {
        const localDir = dirname(localPath);
        try {
          await deno.mkdir(localDir, { recursive: true });
        } catch (e) {}

        const content = await rsp.clone().text();
        const encoder = new TextEncoder();
        await deno.writeFile(localPath, encoder.encode(content));
      } else {
        const diagnostic = buildError(diagnostics);
        diagnostic.messageText = `Unable to fetch: ${remoteUrl}, ${rsp.status}`;
      }
    } catch (e) {
      catchError(diagnostics, e);
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
    async createDir(p, opts) {
      const results: CompilerSystemCreateDirectoryResults = {
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
    createDirSync(p, opts) {
      const results: CompilerSystemCreateDirectoryResults = {
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
    createWorkerController: (maxConcurrentWorkers) => createDenoWorkerMainController(sys, maxConcurrentWorkers),
    async destroy() {
      const waits: Promise<void>[] = [];
      destroys.forEach((cb) => {
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
      if (isRemoteHost) {
        // if this sys is hosted from http://, but the path to be
        // imported is a local file, then ensure it is a file:// protocol
        p = convertPathToFileProtocol(p);
      }
      return import(`${p}?${version}`);
    },
    encodeToBase64(str) {
      return Buffer.from(str).toString('base64');
    },
    async ensureDependencies(opts) {
      const timespan = opts.logger.createTimeSpan(`ensure dependencies start`, true);
      const diagnostics: Diagnostic[] = [];
      const stencilDep = opts.dependencies.find((dep) => dep.name === '@stencil/core');
      const typescriptDep = opts.dependencies.find((dep) => dep.name === 'typescript');

      stencilRemoteUrl = new URL(`../../compiler/stencil.js`, import.meta.url).href;
      if (!isRemoteUrl(stencilRemoteUrl)) {
        stencilRemoteUrl = sys.getRemoteModuleUrl({
          moduleId: stencilDep.name,
          version: stencilDep.version,
          path: stencilDep.main,
        });
      }
      stencilBaseUrl = new URL(`../../`, stencilRemoteUrl);
      stencilExePath = sys.getLocalModulePath({
        rootDir: opts.rootDir,
        moduleId: stencilDep.name,
        path: stencilDep.main,
      });

      typescriptRemoteUrl = sys.getRemoteModuleUrl({
        moduleId: typescriptDep.name,
        version: typescriptDep.version,
        path: typescriptDep.main,
      });
      typescriptExePath = sys.getLocalModulePath({
        rootDir: opts.rootDir,
        moduleId: typescriptDep.name,
        path: typescriptDep.main,
      });

      const ensureStencil = fetchWrite(diagnostics, stencilRemoteUrl, stencilExePath);
      const ensureTypescript = fetchWrite(diagnostics, typescriptRemoteUrl, typescriptExePath);

      await Promise.all([ensureStencil, ensureTypescript]);

      sys.getCompilerExecutingPath = () => stencilExePath;

      timespan.finish(`ensure dependencies end`);

      return {
        stencilPath: stencilExePath,
        typescriptPath: typescriptExePath,
        diagnostics,
      };
    },
    async ensureResources(opts) {
      const stencilDep = opts.dependencies.find((dep) => dep.name === '@stencil/core');
      const typescriptDep = opts.dependencies.find((dep) => dep.name === 'typescript');

      const deps: { url: string; path: string }[] = [];

      const stencilPkg = sys.getLocalModulePath({
        rootDir: opts.rootDir,
        moduleId: stencilDep.name,
        path: 'package.json',
      });
      const typescriptPkg = sys.getLocalModulePath({
        rootDir: opts.rootDir,
        moduleId: typescriptDep.name,
        path: 'package.json',
      });

      const stencilCheck = sys.access(stencilPkg);
      const typescriptCheck = sys.access(typescriptPkg);

      const stencilResourcesExist = await stencilCheck;
      const typescriptResourcesExist = await typescriptCheck;

      if (!stencilResourcesExist) {
        opts.logger.debug(`stencilBaseUrl: ${stencilBaseUrl.href}`);
        stencilDep.resources.forEach((p) => {
          deps.push({
            url: new URL(p, stencilBaseUrl).href,
            path: sys.getLocalModulePath({ rootDir: opts.rootDir, moduleId: stencilDep.name, path: p }),
          });
        });
      }

      if (!typescriptResourcesExist) {
        typescriptDep.resources.forEach((p) => {
          deps.push({
            url: sys.getRemoteModuleUrl({ moduleId: typescriptDep.name, version: typescriptDep.version, path: p }),
            path: sys.getLocalModulePath({ rootDir: opts.rootDir, moduleId: typescriptDep.name, path: p }),
          });
        });
      }

      if (deps.length > 0) {
        console.log(deps);
        const ensuredDirs = new Set<string>();
        const timespan = opts.logger.createTimeSpan(`ensure resources start`, true);

        await Promise.all(
          deps.map(async (dep) => {
            const rsp = await fetch(dep.url);
            if (rsp.ok) {
              const content = rsp.text();
              const dir = dirname(dep.path);
              if (!ensuredDirs.has(dir)) {
                sys.createDir(dir, { recursive: true });
                ensuredDirs.add(dir);
              }
              await sys.writeFile(dep.path, await content);
            } else {
              opts.logger.error(`unable to fetch: ${dep.url}`);
            }
          })
        );

        timespan.finish(`ensure resources end: ${deps.length}`);
      }
    },
    exit: async (exitCode) => {
      deno.exit(exitCode);
    },
    getCompilerExecutingPath() {
      return stencilExePath;
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
    hardwareConcurrency,
    async isSymbolicLink(p) {
      try {
        const stat = await deno.stat(p);
        return stat.isSymlink;
      } catch (e) {
        return false;
      }
    },
    nextTick: queueMicrotask,
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
    async readDir(p) {
      const dirEntries: string[] = [];
      try {
        for await (const dirEntry of deno.readDir(p)) {
          dirEntries.push(join(p, dirEntry.name));
        }
      } catch (e) {}
      return dirEntries;
    },
    readDirSync(p) {
      const dirEntries: string[] = [];
      try {
        for (const dirEntry of deno.readDirSync(p)) {
          dirEntries.push(join(p, dirEntry.name));
        }
      } catch (e) {}
      return dirEntries;
    },
    async readFile(p: string, encoding?: string) {
      try {
        const data = await deno.readFile(p);
        if (encoding === 'binary') {
          return data as any;
        }
        const decoder = new TextDecoder('utf-8');
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
    async removeDir(p, opts) {
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
    removeDirSync(p, opts) {
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
    async removeFile(p) {
      const results: CompilerSystemRemoveFileResults = {
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
    removeFileSync(p) {
      const results: CompilerSystemRemoveFileResults = {
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
    async stat(p) {
      // deno hangs when using `stat()`!?!?!
      // idk why compilerCtx.fs.emptyDirs(cleanDirs) will hang when stat is async
      try {
        const fsStat = deno.statSync(p);
        return {
          isDirectory: fsStat.isDirectory,
          isFile: fsStat.isFile,
          isSymbolicLink: fsStat.isSymlink,
          size: fsStat.size,
          mtimeMs: fsStat.mtime.getTime(),
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
    statSync(p) {
      try {
        const fsStat = deno.statSync(p);
        return {
          isDirectory: fsStat.isDirectory,
          isFile: fsStat.isFile,
          isSymbolicLink: fsStat.isSymlink,
          size: fsStat.size,
          mtimeMs: fsStat.mtime.getTime(),
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
      if (tmpDir == null) {
        tmpDir = dirname(deno.makeTempDirSync());
      }
      return tmpDir;
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
    applyGlobalPatch: async (fromDir) => {
      const { applyNodeCompat } = await import('@deno-node-compat');
      applyNodeCompat({ fromDir });
    },
  };

  return sys;
}
