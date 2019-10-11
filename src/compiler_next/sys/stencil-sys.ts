import * as d from '../../declarations';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from './environment';
import { normalizePath } from '@utils';
import path from 'path';


export const createStencilSys = () => {
  const items = new Map<string, FsItem>();

  const normalize = (p: string) => {
    if (p === '/' || p === '') {
      return '/';
    }
    const dir = path.dirname(p);
    const base = path.basename(p);
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

  const mkdirSync = (p: string, _opts?: d.CompilerSystemMakeDirectoryOptions) => {
    p = normalize(p);
    const item = items.get(p);
    if (!item) {
      items.set(p, {
        basename: path.basename(p),
        dirname: path.dirname(p),
        isDirectory: true,
        isFile: false,
        watcherCallback: null,
        data: undefined
      });
    } else {
      item.isDirectory = true;
      item.isFile = false;
    }
    emitDirectoryWatch(p, new Set());
    return true;
  };

  const mkdir = async (p: string, opts?: d.CompilerSystemMakeDirectoryOptions) => mkdirSync(p, opts);

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
      const s: d.CompilerFsStats = {
        isDirectory: () => item.isDirectory,
        isFile: () => item.isFile,
        isSymbolicLink: () => false,
        size: item.isFile ? item.data.length : 0
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
      if (item.watcherCallback) {
        item.watcherCallback(p, 'fileDelete');
      }
      items.delete(p);
      emitDirectoryWatch(p, new Set());
    }
    return true;
  };

  const unlink = async (p: string) => unlinkSync(p);

  const watchDirectory = (p: string, dirWatcherCallback: d.CompilerFileWatcherCallback) => {
    p = normalize(p);
    const item = items.get(p);
    if (item) {
      item.isDirectory = true;
      item.isFile = false;
      item.watcherCallback = dirWatcherCallback;
    } else {
      items.set(p, {
        basename: path.basename(p),
        dirname: path.dirname(p),
        isDirectory: true,
        isFile: false,
        watcherCallback: dirWatcherCallback,
        data: undefined
      });
    }

    return {
      close() {
        const closeItem = items.get(p);
        if (closeItem) {
          closeItem.watcherCallback = null;
        }
      }
    };
  };

  const watchFile = (p: string, fileWatcherCallback: d.CompilerFileWatcherCallback) => {
    p = normalize(p);
    const item = items.get(p);
    if (item) {
      item.isDirectory = false;
      item.isFile = true;
      item.watcherCallback = fileWatcherCallback;
    } else {
      items.set(p, {
        basename: path.basename(p),
        dirname: path.dirname(p),
        isDirectory: true,
        isFile: false,
        watcherCallback: fileWatcherCallback,
        data: undefined
      });
    }

    return {
      close() {
        const closeItem = items.get(p);
        if (closeItem) {
          closeItem.watcherCallback = null;
        }
      }
    };
  };

  const emitDirectoryWatch = (p: string, emitted: Set<string>) => {
    const parentDir = normalize(path.dirname(p));
    const dirItem = items.get(parentDir);

    if (dirItem && dirItem.isDirectory && dirItem.watcherCallback) {
      dirItem.watcherCallback(p, null);
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
      const shouldEmitUpdate = (item.watcherCallback && item.data !== data);
      item.data = data;
      if (shouldEmitUpdate) {
        item.watcherCallback(p, 'fileUpdate');
      }

    } else {
      items.set(p, {
        basename: path.basename(p),
        dirname: path.dirname(p),
        isDirectory: false,
        isFile: true,
        watcherCallback: null,
        data
      });

      emitDirectoryWatch(p, new Set());
    }
    return true;
  };

  const writeFile = async (p: string, data: string) => writeFileSync(p, data);

  const fileWatchTimeout = 32;

  mkdirSync('/');

  const sys: d.CompilerSystem = {
    access,
    accessSync,
    copyFile,
    fileWatchTimeout,
    getCurrentDirectory,
    getCompilerExecutingPath,
    mkdir,
    mkdirSync,
    readdir,
    readdirSync,
    readFile,
    readFileSync,
    realpath,
    realpathSync,
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
  };

  return sys;
};

interface FsItem {
  data: string;
  basename: string;
  dirname: string;
  isFile: boolean;
  isDirectory: boolean;
  watcherCallback: d.CompilerFileWatcherCallback;
}
