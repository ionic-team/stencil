import * as d from '../../../declarations';
import { COMMON_DIR_FILENAMES, NODE_MODULES_FS_DIR, getCdnPackageJsonUrl, getCommonDirName, isCommonDirModuleFile, shouldFetchModule } from './resolve-utils';
import { fetchModuleSync } from '../fetch/fetch-module-sync';
import { getCommonDirUrl, getNodeModuleFetchUrl, packageVersions } from '../fetch/fetch-utils';
import { isString, IS_WEB_WORKER_ENV, normalizeFsPath } from '@utils';
import { dirname, join } from 'path';
import resolve, { SyncOpts } from 'resolve';

export const resolveRemoteModuleIdSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, containingFile: string) => {
  const packageJson = resolveRemotePackageJsonSync(config, inMemoryFs, moduleId);
  if (packageJson) {
    const fromDir = dirname(containingFile);
    const resolvedUrl = resolveModuleIdSync(config, inMemoryFs, moduleId, fromDir, ['.js', '.mjs']);
    if (isString(resolvedUrl)) {
      return {
        resolvedUrl,
        packageJson,
      };
    }
  }
  return null;
};

export const resolveRemotePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string) => {
  const filePath = join(config.rootDir, 'node_modules', moduleId, 'package.json');
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
    pkgPath = packagePath.endsWith('package.json') ? packagePath : join(packagePath, 'package.json');

    return pkg;
  };
  resolve.sync(moduleId, opts);
  return pkgPath;
};

export const resolveModuleIdSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, basedir: string, exts: string[]) => {
  const opts = createCustomResolverSync(config, inMemoryFs, basedir, exts);
  return resolve.sync(moduleId, opts);
};

export const createCustomResolverSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, basedir: string, exts: string[]): SyncOpts => {
  const compilerExecutingPath = config.sys.getCompilerExecutingPath();

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

    extensions: exts,
  } as any;
};
