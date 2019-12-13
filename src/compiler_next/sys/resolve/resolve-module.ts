import * as d from '../../../declarations';
import { NODE_MODULES_FS_DIR, getCdnPackageJsonUrl, getCommonDirName, isCommonDirModuleFile } from './resolve-utils';
import { fetchModuleAsync } from '../fetch/fetch-module-async';
import { fetchModuleSync } from '../fetch/fetch-module-sync';
import { getCommonDirUrl, getNodeModuleFetchUrl, packageVersions } from '../fetch/fetch-utils';
import { IS_FETCH_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { isString, normalizeFsPath } from '@utils';
import path from 'path';
import resolve from 'resolve';


export const resolveRemoteModuleId = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, containingFile: string) => {
  const packageJson = resolveRemotePackageJsonSync(config, inMemoryFs, moduleId);
  if (packageJson) {
    const fromDir = path.dirname(containingFile);
    const resolvedUrl = resolveModuleIdSync(config, inMemoryFs, moduleId, fromDir, ['.js', '.mjs']);
    if (isString(resolvedUrl)) {
      return {
        resolvedUrl,
        packageJson,
      }
    }
  }
  return null;
}


export const resolveRemotePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string) => {
  const filePath = path.join(config.rootDir, 'node_modules', moduleId, 'package.json');
  let pkgJson = inMemoryFs.readFileSync(filePath);
  if (!isString(pkgJson) && IS_WEB_WORKER_ENV) {
    const url = getCdnPackageJsonUrl(moduleId);
    pkgJson = fetchModuleSync(inMemoryFs, packageVersions, url, filePath);
  }
  if (isString(pkgJson)) {
    try {
      return JSON.parse(pkgJson) as d.PackageJsonData;
    } catch (e) {}
  }
  return null;
};


export const resolvePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, basedir: string) => {
  const opts = createCustomResolverSync(config, inMemoryFs, basedir, ['.json']);
  let pkgPath = '';
  opts.packageFilter = (pkg: any, packagePath: string) => {
    // Workaround: https://github.com/browserify/resolve/pull/202
    pkgPath = packagePath.endsWith('package.json')
      ? packagePath
      : path.join(packagePath, 'package.json');

    return pkg;
  };
  resolve.sync(moduleId, opts);
  return pkgPath;
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
      const fsFilePath = normalizeFsPath(filePath);

      const stat = inMemoryFs.statSync(fsFilePath);
      if (stat.isFile) {
        return true;
      }

      if (shouldFetchModule(fsFilePath)) {
        const endsWithExt = exts.some(ext => fsFilePath.endsWith(ext));
        if (!endsWithExt) {
          return false;
        }

        const url = getNodeModuleFetchUrl(compilerExecutingPath, packageVersions, fsFilePath);
        const content = fetchModuleSync(inMemoryFs, packageVersions, url, fsFilePath);
        return isString(content);
      }

      return false;
    },

    isDirectory(dirPath: string) {
      const fsDirPath = normalizeFsPath(dirPath);

      const stat = inMemoryFs.statSync(fsDirPath);
      if (stat.isDirectory) {
        return true;
      }

      if (shouldFetchModule(fsDirPath)) {
        if (fsDirPath === NODE_MODULES_FS_DIR) {
          // just the /node_modules directory
          inMemoryFs.sys.mkdirSync(NODE_MODULES_FS_DIR);
          inMemoryFs.clearFileCache(fsDirPath);
          return true;
        }

        if (isCommonDirModuleFile(fsDirPath)) {
          // don't bother seeing if it's a directory if it has a common file extension
          return false;
        }

        const checkFileExists = (fileName: string) => {
          const url = getCommonDirUrl(compilerExecutingPath, packageVersions, fsDirPath, fileName);
          const filePath = getCommonDirName(fsDirPath, fileName);
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
      const fsFilePath = normalizeFsPath(filePath);

      const stat = await inMemoryFs.stat(fsFilePath);
      if (stat.isFile) {
        cb(null, true);
        return;
      }

      if (shouldFetchModule(fsFilePath)) {
        const endsWithExt = exts.some(ext => fsFilePath.endsWith(ext));
        if (endsWithExt) {
          const url = getNodeModuleFetchUrl(compilerExecutingPath, packageVersions, fsFilePath);
          const content = await fetchModuleAsync(inMemoryFs, packageVersions, url, fsFilePath);
          const checkFileExists = isString(content);
          cb(null, checkFileExists);
          return;
        }
      }

      cb(null, false);
    },

    async isDirectory(dirPath: string, cb: (err: any, isDirectory: boolean) => void) {
      const fsDirPath = normalizeFsPath(dirPath);

      const stat = await inMemoryFs.stat(fsDirPath);
      if (stat.isDirectory) {
        cb(null, true);
        return;
      }

      if (shouldFetchModule(fsDirPath)) {
        if (fsDirPath === NODE_MODULES_FS_DIR) {
          // just the /node_modules directory
          inMemoryFs.sys.mkdirSync(NODE_MODULES_FS_DIR);
          inMemoryFs.clearFileCache(fsDirPath);
          cb(null, true);
          return;
        }

        if (isCommonDirModuleFile(fsDirPath)) {
          // don't bother seeing if it's a directory if it has a common file extension
          cb(null, false);
          return;
        }

        for (const fileName of COMMON_DIR_FILENAMES) {
          const url = getCommonDirUrl(compilerExecutingPath, packageVersions, fsDirPath, fileName);
          const filePath = getCommonDirName(fsDirPath, fileName);
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
      const fsFilePath = normalizeFsPath(p);

      const data = await inMemoryFs.readFile(fsFilePath);
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
