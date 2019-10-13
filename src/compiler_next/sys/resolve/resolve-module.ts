import * as d from '../../../declarations';
import { NODE_MODULES_FS_DIR, getCdnPackageJsonUrl, getCommonDirName, getCommonDirUrl, getNodeModuleFetchUrl, isCommonDirModuleFile, setPkgVersion, skipFilePathFetch, skipUrlFetch } from './resolve-utils';
import { IS_FETCH_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { isString, normalizePath } from '@utils';
import path from 'path';
import resolve from 'resolve';

const known404Urls = new Set<string>();
const fetchCacheAsync = new Map<string, Promise<string>>();
const pkgVersions = new Map<string, string>();


export const resolveRemotePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string) => {
  const filePath = path.join(config.rootDir, 'node_modules', moduleId, 'package.json');
  let pkgJson = inMemoryFs.readFileSync(filePath);
  if (!isString(pkgJson) && IS_WEB_WORKER_ENV) {
    const url = getCdnPackageJsonUrl(moduleId);
    pkgJson = fetchModuleSync(inMemoryFs, url, filePath);
  }
  if (isString(pkgJson)) {
    return JSON.parse(pkgJson) as d.PackageJsonData;
  }
  return null;
};


export const resolveModuleIdSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, containingFile: string, exts: string[]) => {
  const opts = createCustomResolverSync(config, inMemoryFs, exts);
  opts.basedir = path.dirname(containingFile);
  return resolve.sync(moduleId, opts);
};


export const createCustomResolverSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, exts: string[]) => {
  const compilerExecutingPath = config.sys_next.getCompilerExecutingPath();

  return {

    isFile(filePath: string) {
      filePath = normalizePath(filePath);

      const stat = inMemoryFs.statSync(filePath);
      if (stat.isFile) {
        return true;
      }

      if (shouldFetchModule(filePath)) {
        const endsWithExt = exts.some(ext => filePath.endsWith(ext));
        if (!endsWithExt) {
          return false;
        }

        const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
        const content = fetchModuleSync(inMemoryFs, url, filePath);
        return isString(content);
      }

      return false;
    },

    isDirectory(dirPath: string) {
      dirPath = normalizePath(dirPath);

      const stat = inMemoryFs.statSync(dirPath);
      if (stat.isDirectory) {
        return true;
      }

      if (shouldFetchModule(dirPath)) {
        if (dirPath === NODE_MODULES_FS_DIR) {
          // just the /node_modules directory
          inMemoryFs.sys.mkdirSync(NODE_MODULES_FS_DIR);
          inMemoryFs.clearFileCache(dirPath);
          return true;
        }

        if (isCommonDirModuleFile(dirPath)) {
          // don't bother seeing if it's a directory if it has a common file extension
          return false;
        }

        const checkFileExists = (fileName: string) => {
          const url = getCommonDirUrl(compilerExecutingPath, pkgVersions, dirPath, fileName);
          const filePath = getCommonDirName(dirPath, fileName);
          const content = fetchModuleSync(inMemoryFs, url, filePath);
          return isString(content);
        };

        return COMMON_DIR_FILENAMES.some(checkFileExists);
      }

      return false;
    },

    readFileSync(p: string) {
      const data = inMemoryFs.readFileSync(p);
      if (isString(data)) {
        return data;
      }

      throw new Error(`file not found: ${p}`);
    },

    extensions: exts
  } as any;
};


export const createCustomResolverAsync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, exts: string[]) => {
  const compilerExecutingPath = config.sys_next.getCompilerExecutingPath();

  return {

    async isFile(filePath: string, cb: (err: any, isFile: boolean) => void) {
      filePath = normalizePath(filePath);

      const stat = await inMemoryFs.stat(filePath);
      if (stat.isFile) {
        cb(null, true);
        return;
      }

      if (shouldFetchModule(filePath)) {
        const endsWithExt = exts.some(ext => filePath.endsWith(ext));
        if (endsWithExt) {
          const url = getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, filePath);
          const content = await fetchModuleAsync(inMemoryFs, url, filePath);
          const checkFileExists = isString(content);
          cb(null, checkFileExists);
          return;
        }
      }

      cb(null, false);
    },

    async isDirectory(dirPath: string, cb: (err: any, isDirectory: boolean) => void) {
      dirPath = normalizePath(dirPath);

      const stat = await inMemoryFs.stat(dirPath);
      if (stat.isDirectory) {
        cb(null, true);
        return;
      }

      if (shouldFetchModule(dirPath)) {
        if (dirPath === NODE_MODULES_FS_DIR) {
          // just the /node_modules directory
          inMemoryFs.sys.mkdirSync(NODE_MODULES_FS_DIR);
          inMemoryFs.clearFileCache(dirPath);
          cb(null, true);
          return;
        }

        if (isCommonDirModuleFile(dirPath)) {
          // don't bother seeing if it's a directory if it has a common file extension
          cb(null, false);
          return;
        }

        for (const fileName of COMMON_DIR_FILENAMES) {
          const url = getCommonDirUrl(compilerExecutingPath, pkgVersions, dirPath, fileName);
          const filePath = getCommonDirName(dirPath, fileName);
          const content = await fetchModuleAsync(inMemoryFs, url, filePath);
          if (isString(content)) {
            cb(null, true);
            return;
          }
        }
      }

      cb(null, false);
    },

    async readFile(p: string, cb: (err: any, data: string) => void) {
      p = normalizePath(p);

      const data = await inMemoryFs.readFile(p);
      if (isString(data)) {
        return cb(null, data);
      }

      return cb(`readFile not found: ${p}`, undefined);
    },

    extensions: exts,
  } as any;
};

const COMMON_DIR_FILENAMES = ['package.json', 'index.js', 'index.mjs'];

const fetchModuleSync = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath)) {
    return undefined;
  }

  const content = fetchUrlSync(url);
  if (isString(content)) {
    writeFetchSuccess(inMemoryFs, url, filePath, content, pkgVersions);
  }

  return content;
};

export const fetchUrlSync = (url: string) => {
  if (known404Urls.has(url) || skipUrlFetch(url)) {
    return undefined;
  }

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);

    if (xhr.status >= 200 && xhr.status < 300) {
      return xhr.responseText;
    }

    known404Urls.add(url);

  } catch (e) {
    known404Urls.add(url);
  }

  return undefined;
};

const fetchModuleAsync = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath) || known404Urls.has(url) || skipUrlFetch(url)) {
    return Promise.resolve(undefined);
  }

  let fetchPromise = fetchCacheAsync.get(url);

  if (!fetchPromise) {
    fetchPromise = new Promise(resolve => {
      fetch(url)
        .then(async rsp => {
          if (rsp.status >= 200 && rsp.status < 300) {
            const content = await rsp.text();
            writeFetchSuccess(inMemoryFs, url, filePath, content, pkgVersions);
            resolve(content);

          } else {
            known404Urls.add(url);
            resolve(undefined);
          }
        })
        .catch(() => {
          known404Urls.add(url);
          resolve(undefined);
        });
    });
    fetchCacheAsync.set(url, fetchPromise);
  }

  return fetchPromise;
};

const writeFetchSuccess = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string, content: string, pkgVersions: Map<string, string>) => {
  if (url.endsWith('package.json')) {
    setPkgVersion(content, pkgVersions);
  }

  let dir = path.dirname(filePath);
  while (dir !== '/' && dir !== '') {
    inMemoryFs.clearFileCache(dir);
    inMemoryFs.sys.mkdirSync(dir);
    dir = path.dirname(dir);
  }

  inMemoryFs.clearFileCache(filePath);
  inMemoryFs.sys.writeFileSync(filePath, content);
};


const shouldFetchModule = (p: string) => (IS_FETCH_ENV && !IS_NODE_ENV && p.startsWith(NODE_MODULES_FS_DIR + '/'));
