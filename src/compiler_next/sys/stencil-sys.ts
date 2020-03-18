import { CompilerFileWatcherCallback, CompilerFsStats, CompilerSystem, CompilerSystemMakeDirectoryOptions, CopyResults, CopyTask, SystemDetails } from '../../declarations';
import { basename, dirname } from 'path';
import { buildEvents } from '../events';
import { createWebWorkerMainController } from '../sys/worker/web-worker-main';
import { HAS_WEB_WORKER, IS_NODE_ENV, IS_WEB_WORKER_ENV, normalizePath } from '@utils';

export const createSystem = () => {
  const items = new Map<string, FsItem>();
  const destroys = new Set<() => Promise<void> | void>();

  const addDestory = (cb: () => void) => destroys.add(cb);
  const removeDestory = (cb: () => void) => destroys.delete(cb);
  const events = buildEvents();

  const destroy = async () => {
    const waits: Promise<void>[] = [];
    destroys.forEach(cb => {
      try {
        const rtn = cb();
        if (rtn && rtn.then) {
          waits.push(rtn);
        }
      } catch (e) {
        console.error(`stencil sys destroy: ${e}`);
      }
    });
    await Promise.all(waits);
    destroys.clear();
  };

  const normalize = (p: string) => {
    if (p === '/' || p === '') {
      return '/';
    }
    const dir = dirname(p);
    const base = basename(p);
    if (dir.endsWith('/')) {
      return normalizePath(`${dir}${base}`);
    }
    return normalizePath(`${dir}/${base}`);
  };

  const accessSync = (p: string) => {
    const item = items.get(normalize(p));
    return !!(item && (item.isDirectory || item.isFile));
  };

  const access = async (p: string) => accessSync(p);

  const copyFile = async (src: string, dest: string) => {
    writeFileSync(dest, readFileSync(src));
    return true;
  };

  const encodeToBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

  const getCurrentDirectory = () => {
    if (IS_NODE_ENV) {
      return global['process'].cwd();
    }
    return '/';
  };

  const getCompilerExecutingPath = () => {
    if (IS_NODE_ENV) {
      return __filename;
    }
    if (IS_WEB_WORKER_ENV) {
      return location.href;
    }
    throw new Error('unable to find executing path');
  };

  const isSymbolicLink = (_p: string) =>
    new Promise<boolean>(resolve => {
      resolve(false);
    });

  const mkdirSync = (p: string, _opts?: CompilerSystemMakeDirectoryOptions) => {
    p = normalize(p);
    const item = items.get(p);
    if (!item) {
      items.set(p, {
        basename: basename(p),
        dirname: dirname(p),
        isDirectory: true,
        isFile: false,
        watcherCallbacks: null,
        data: undefined,
      });
      emitDirectoryWatch(p, new Set());
    } else {
      item.isDirectory = true;
      item.isFile = false;
    }
    return true;
  };

  const mkdir = async (p: string, opts?: CompilerSystemMakeDirectoryOptions) => mkdirSync(p, opts);

  const readdirSync = (p: string) => {
    p = normalize(p);
    const dirItems: string[] = [];
    const dir = items.get(p);
    if (dir && dir.isDirectory) {
      items.forEach((item, itemPath) => {
        if (itemPath !== '/') {
          if (p.endsWith('/') && `${p}${item.basename}` === itemPath) {
            dirItems.push(itemPath);
          } else if (`${p}/${item.basename}` === itemPath) {
            dirItems.push(itemPath);
          }
        }
      });
    }
    return dirItems.sort();
  };

  const readdir = async (p: string) => readdirSync(p);

  const readFileSync = (p: string) => {
    p = normalize(p);
    const item = items.get(p);
    if (item && item.isFile) {
      return item.data;
    }
    return undefined;
  };

  const readFile = async (p: string) => readFileSync(p);

  const realpathSync = (p: string) => normalize(p);

  const realpath = async (p: string) => realpathSync(p);

  const resolvePath = (p: string) => normalize(p);

  const rmdirSync = (p: string) => {
    p = normalize(p);
    items.delete(p);
    emitDirectoryWatch(p, new Set());
    return true;
  };

  const rmdir = async (p: string) => rmdirSync(p);

  const statSync = (p: string) => {
    p = normalize(p);
    const item = items.get(p);
    if (item && (item.isDirectory || item.isFile)) {
      const s: CompilerFsStats = {
        isDirectory: () => item.isDirectory,
        isFile: () => item.isFile,
        isSymbolicLink: () => false,
        size: item.isFile ? item.data.length : 0,
      };
      return s;
    }
    return undefined;
  };

  const stat = async (p: string) => statSync(p);

  const unlinkSync = (p: string) => {
    p = normalize(p);
    const item = items.get(p);
    if (item) {
      if (item.watcherCallbacks) {
        item.watcherCallbacks.forEach(watcherCallback => {
          watcherCallback(p, 'fileDelete');
        });
      }
      items.delete(p);
      emitDirectoryWatch(p, new Set());
    }
    return true;
  };

  const unlink = async (p: string) => unlinkSync(p);

  const watchDirectory = (p: string, dirWatcherCallback: CompilerFileWatcherCallback) => {
    p = normalize(p);
    const item = items.get(p);

    const close = () => {
      const closeItem = items.get(p);
      if (closeItem && closeItem.watcherCallbacks) {
        const index = closeItem.watcherCallbacks.indexOf(dirWatcherCallback);
        if (index > -1) {
          closeItem.watcherCallbacks.splice(index, 1);
        }
      }
    };

    addDestory(close);

    if (item) {
      item.isDirectory = true;
      item.isFile = false;
      item.watcherCallbacks = item.watcherCallbacks || [];
      item.watcherCallbacks.push(dirWatcherCallback);
    } else {
      items.set(p, {
        basename: basename(p),
        dirname: dirname(p),
        isDirectory: true,
        isFile: false,
        watcherCallbacks: [dirWatcherCallback],
        data: undefined,
      });
    }

    return {
      close() {
        removeDestory(close);
        close();
      },
    };
  };

  const watchFile = (p: string, fileWatcherCallback: CompilerFileWatcherCallback) => {
    p = normalize(p);
    const item = items.get(p);

    const close = () => {
      const closeItem = items.get(p);
      if (closeItem && closeItem.watcherCallbacks) {
        const index = closeItem.watcherCallbacks.indexOf(fileWatcherCallback);
        if (index > -1) {
          closeItem.watcherCallbacks.splice(index, 1);
        }
      }
    };

    addDestory(close);

    if (item) {
      item.isDirectory = false;
      item.isFile = true;
      item.watcherCallbacks = item.watcherCallbacks || [];
      item.watcherCallbacks.push(fileWatcherCallback);
    } else {
      items.set(p, {
        basename: basename(p),
        dirname: dirname(p),
        isDirectory: true,
        isFile: false,
        watcherCallbacks: [fileWatcherCallback],
        data: undefined,
      });
    }

    return {
      close() {
        removeDestory(close);
        close();
      },
    };
  };

  const emitDirectoryWatch = (p: string, emitted: Set<string>) => {
    const parentDir = normalize(dirname(p));
    const dirItem = items.get(parentDir);

    if (dirItem && dirItem.isDirectory && dirItem.watcherCallbacks) {
      dirItem.watcherCallbacks.forEach(watcherCallback => {
        watcherCallback(p, null);
      });
    }
    if (!emitted.has(parentDir)) {
      emitted.add(parentDir);
      emitDirectoryWatch(parentDir, emitted);
    }
  };

  const writeFileSync = (p: string, data: string) => {
    p = normalize(p);
    const item = items.get(p);
    if (item) {
      const hasChanged = item.data !== data;
      item.data = data;
      if (hasChanged && item.watcherCallbacks) {
        item.watcherCallbacks.forEach(watcherCallback => {
          watcherCallback(p, 'fileUpdate');
        });
      }
    } else {
      items.set(p, {
        basename: basename(p),
        dirname: dirname(p),
        isDirectory: false,
        isFile: true,
        watcherCallbacks: null,
        data,
      });

      emitDirectoryWatch(p, new Set());
    }
    return true;
  };

  const generateContentHash = async (content: string) => {
    const arrayBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
    const hashArray = Array.from(new Uint8Array(arrayBuffer)); // convert buffer to byte array
    let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    if (typeof length === 'number') {
      hashHex = hashHex.substr(0, length);
    }
    return hashHex;
  };

  const writeFile = async (p: string, data: string) => writeFileSync(p, data);

  const copy = async (copyTasks: Required<CopyTask>[], srcDir: string) => {
    const results: CopyResults = {
      diagnostics: [],
      dirPaths: [],
      filePaths: [],
    };
    console.log('todo, copy task', copyTasks.length, srcDir);
    return results;
  };

  const fileWatchTimeout = 32;

  mkdirSync('/');

  const sys: CompilerSystem = {
    events,
    access,
    accessSync,
    addDestory,
    copyFile,
    destroy,
    encodeToBase64,
    watchTimeout: fileWatchTimeout,
    getCurrentDirectory,
    getCompilerExecutingPath,
    isSymbolicLink,
    mkdir,
    mkdirSync,
    readdir,
    readdirSync,
    readFile,
    readFileSync,
    realpath,
    realpathSync,
    removeDestory,
    resolvePath,
    rmdir,
    rmdirSync,
    stat,
    statSync,
    unlink,
    unlinkSync,
    watchDirectory,
    watchFile,
    writeFile,
    writeFileSync,
    generateContentHash,
    createWorkerController: HAS_WEB_WORKER ? createWebWorkerMainController : null,
    details: getDetails(),
    copy,
  };

  return sys;
};

interface FsItem {
  data: string;
  basename: string;
  dirname: string;
  isFile: boolean;
  isDirectory: boolean;
  watcherCallbacks: CompilerFileWatcherCallback[];
}

const getDetails = () => {
  const details: SystemDetails = {
    cpuModel: '',
    cpus: -1,
    freemem() {
      return 0;
    },
    platform: '',
    release: '',
    runtime: 'node',
    runtimeVersion: '',
    tmpDir: '/.tmp',
    totalmem: -1,
  };
  return details;
};
