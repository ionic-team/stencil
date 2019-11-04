import * as d from '../../../declarations';
import { NODE_MODULES_FS_DIR, getCdnPackageJsonUrl, getCommonDirName, isCommonDirModuleFile } from './resolve-utils';
import { fetchModuleAsync } from '../fetch/fetch-module-async';
import { fetchModuleSync } from '../fetch/fetch-module-sync';
import { getCommonDirUrl, getNodeModuleFetchUrl, packageVersions } from '../fetch/fetch-utils';
import { IS_FETCH_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { isString, normalizePath } from '@utils';
import path from 'path';
import resolve from 'resolve';


export const resolveRemotePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string) => {
  const filePath = path.join(config.rootDir, 'node_modules', moduleId, 'package.json');
  let pkgJson = inMemoryFs.readFileSync(filePath);
  if (!isString(pkgJson) && IS_WEB_WORKER_ENV) {
    const url = getCdnPackageJsonUrl(moduleId);
    pkgJson = fetchModuleSync(inMemoryFs, packageVersions, url, filePath);
  }
  if (isString(pkgJson)) {
    return JSON.parse(pkgJson) as d.PackageJsonData;
  }
  return null;
};


export const resolveModuleIdSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, basedir: string, exts: string[]) => {
  const opts = createCustomResolverSync(config, inMemoryFs, basedir, exts);
  return resolve.sync(moduleId, opts);
};


export const createCustomResolverSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, basedir: string, exts: string[]) => {
  const compilerExecutingPath = config.sys_next.getCompilerExecutingPath();

  return {
    basedir,

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

        const url = getNodeModuleFetchUrl(compilerExecutingPath, packageVersions, filePath);
        const content = fetchModuleSync(inMemoryFs, packageVersions, url, filePath);
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
          const url = getCommonDirUrl(compilerExecutingPath, packageVersions, dirPath, fileName);
          const filePath = getCommonDirName(dirPath, fileName);
          const content = fetchModuleSync(inMemoryFs, packageVersions, url, filePath);
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
          const url = getNodeModuleFetchUrl(compilerExecutingPath, packageVersions, filePath);
          const content = await fetchModuleAsync(inMemoryFs, packageVersions, url, filePath);
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
          const url = getCommonDirUrl(compilerExecutingPath, packageVersions, dirPath, fileName);
          const filePath = getCommonDirName(dirPath, fileName);
          const content = await fetchModuleAsync(inMemoryFs, packageVersions, url, filePath);
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


const shouldFetchModule = (p: string) => (IS_FETCH_ENV && !IS_NODE_ENV && p.startsWith(NODE_MODULES_FS_DIR + '/'));
