import * as d from '../../declarations';
import { IS_FETCH_ENV, IS_NODE_ENV } from '../sys/environment';
import { normalizePath } from '@utils';
import path from 'path';
import resolve from 'resolve';


export const resolveRemotePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string) => {
  const filePath = path.join(config.rootDir, 'node_modules', moduleId, 'package.json');
  let pkgJson = inMemoryFs.readFileSync(filePath);
  if (!pkgJson) {
    const url = new URL(`./${moduleId}/package.json`, NODE_MODULES_CDN_URL).href;
    pkgJson = fetchModuleSync(inMemoryFs, url, filePath);
  }
  if (typeof pkgJson === 'string') {
    return JSON.parse(pkgJson) as d.PackageJsonData;
  }
  return null;
};


export const resolveModuleIdSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, containingFile: string, exts: string[]) => {
  const opts = createCustomResolverSync(config, inMemoryFs, exts);
  opts.basedir = path.dirname(containingFile);
  return resolve.sync(moduleId, opts);
};


export const resolveModuleIdAync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, containingFile: string, exts: string[]) => {
  const opts = createCustomResolverAsync(config, inMemoryFs, exts);
  opts.basedir = path.dirname(containingFile);
  return new Promise(r => {
    resolve(moduleId, (_, resolved) => {
      r(resolved);
    });
  });
};


export const createCustomResolverSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, exts: string[]) => {
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

        const url = getModuleFetchUrl(config, filePath);
        const content = fetchModuleSync(inMemoryFs, url, filePath);
        if (content) {
          return true;
        }
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
          inMemoryFs.sys.mkdirSync(NODE_MODULES_FS_DIR);
          inMemoryFs.clearFileCache(dirPath);
          return true;
        }

        const endsWithExt = COMMON_DIR_MODULE_EXTS.some(ext => dirPath.endsWith(ext));
        if (endsWithExt) {
          return false;
        }

        const checkFileExists = (fileName: string) => {
          const url = getModuleFetchUrl(config, dirPath) + '/' + fileName;
          const filePath = dirPath + '/' + fileName;
          const content = fetchModuleSync(inMemoryFs, url, filePath);
          return (!!content);
        };

        return ['package.json', 'index.js', 'index.mjs'].some(checkFileExists);
      }

      return false;
    },

    readFileSync(p: string) {
      const data = inMemoryFs.readFileSync(p);
      if (typeof data === 'string') {
        return data;
      }

      throw new Error(`file not found: ${p}`);
    },

    extensions: exts
  } as any;
};


export const createCustomResolverAsync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, exts: string[]) => {
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
          const url = getModuleFetchUrl(config, filePath);
          const content = await fetchModuleAsync(inMemoryFs, url, filePath);
          const checkFileExists = (typeof content === 'string');
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
          inMemoryFs.sys.mkdirSync(NODE_MODULES_FS_DIR);
          inMemoryFs.clearFileCache(dirPath);
          cb(null, true);
          return;
        }

        const endsWithExt = COMMON_DIR_MODULE_EXTS.some(ext => dirPath.endsWith(ext));
        if (endsWithExt) {
          cb(null, false);
          return;
        }

        const checkFiles = ['package.json', 'index.js', 'index.mjs'];
        for (const fileName of checkFiles) {
          const url = getModuleFetchUrl(config, dirPath) + '/' + fileName;
          const filePath = dirPath + '/' + fileName;
          const content = await fetchModuleAsync(inMemoryFs, url, filePath);
          if (typeof content === 'string') {
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
      if (typeof data === 'string') {
        return cb(null, data);
      }

      return cb(`readFile not found: ${p}`, undefined);
    },

    extensions: exts,
  } as any;
};


const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];

const known404Urls = new Set<string>();
const fetchCacheAsync = new Map<string, Promise<string>>();
const pkgVersions = new Map<string, string>();

const skipFilePathFetch = (filePath: string) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    // don't bother trying to resolve  node_module packages w/ typescript files
    // they should already be .js files
    return true;
  }

  const pathParts = filePath.split('/');
  const secondToLast = pathParts[pathParts.length - 2];
  const lastPart = pathParts[pathParts.length - 1];
  if (secondToLast === 'node_modules' && COMMON_DIR_MODULE_EXTS.some(ext => lastPart.endsWith(ext))) {
    // /node_modules/index.js
    // /node_modules/lodash.js
    // we just already know this is bogus, so don't bother
    return true;
  }

  return false;
};

const skipUrlFetch = (url: string) => {
  // files we just already know not to try to resolve
  if (knownUrlSkips.some(knownSkip => url.endsWith(knownSkip))) {
    return true;
  }
  return false;
};

const fetchModuleSync = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath)) {
    return undefined;
  }

  const content = fetchUrlSync(url);
  if (typeof content === 'string') {
    writeFetchSuccess(inMemoryFs, url, filePath, content);
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

    } else {
      known404Urls.add(url);
    }

  } catch (e) {
    known404Urls.add(url);
  }

  return undefined;
};


const fetchModuleAsync = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string) => {
  if (skipFilePathFetch(filePath) || skipUrlFetch(url)) {
    return Promise.resolve(undefined);
  }

  let fetchPromise = fetchCacheAsync.get(url);

  if (!fetchPromise) {
    fetchPromise = new Promise(resolve => {
      fetch(url)
        .then(async rsp => {
          if (rsp.status >= 200 && rsp.status < 300) {
            const content = await rsp.text();
            writeFetchSuccess(inMemoryFs, url, filePath, content);
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

const writeFetchSuccess = (inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string, content: string) => {
  if (url.endsWith('package.json')) {
    try {
      const pkgData = JSON.parse(content) as d.PackageJsonData;
      if (pkgData.name && pkgData.version) {
        pkgVersions.set(pkgData.name, pkgData.version);
      }
    } catch (e) {}
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


const getModuleFetchUrl = (config: d.Config, filePath: string) => {
  // /node_modules/lodash/package.json
  const pathParts = filePath.split('/').filter(p => p.length);
  // ["node_modules", "lodash", "package.json"]

  if (pathParts[0] === 'node_modules') {
    // ["lodash", "package.json"]
    pathParts.shift();
  }

  let urlPath = filePath.replace(NODE_MODULES_FS_DIR + '/', '');
  if (pathParts[0] === '@stencil' && pathParts[1] === 'core') {
    // ["@stencil", "core", ...]
    const compilerPath = config.sys_next.getCompilerExecutingPath();
    const stencilCoreUrlRoot = new URL('../../../', compilerPath).href;
    return new URL('./' + pathParts.join('/'), stencilCoreUrlRoot).href;
  }

  const checkPathParts: string[] = [];
  for (const pathPart of pathParts) {
    checkPathParts.push(pathPart);
    const checkPathPart = checkPathParts.join('/');
    const checkVersion = pkgVersions.get(checkPathPart);
    if (checkVersion) {
      urlPath = urlPath.replace(checkPathPart + '/', checkPathPart + '@' + checkVersion + '/');
      break;
    }
  }

  return NODE_MODULES_CDN_URL + urlPath;
};

const shouldFetchModule = (p: string) => (IS_FETCH_ENV && !IS_NODE_ENV && p.startsWith(NODE_MODULES_FS_DIR));

const NODE_MODULES_FS_DIR = '/node_modules';
const NODE_MODULES_CDN_URL = 'https://cdn.jsdelivr.net/npm/';

const knownUrlSkips = [
  '/@stencil/core/internal.mjs',
  '/@stencil/core/internal.js',
  '/@stencil/core/internal.json',
];
