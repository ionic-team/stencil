import type * as d from '../../../declarations';
import { COMMON_DIR_FILENAMES, getCommonDirName, isCommonDirModuleFile, shouldFetchModule } from './resolve-utils';
import { fetchModuleSync } from '../fetch/fetch-module-sync';
import { getCommonDirUrl, getNodeModuleFetchUrl, packageVersions } from '../fetch/fetch-utils';
import { isString, normalizeFsPath, normalizePath } from '@utils';
import { IS_WEB_WORKER_ENV } from '../environment';
import { basename, dirname } from 'path';
import resolve, { SyncOpts } from 'resolve';

export const resolveRemoteModuleIdSync = (
  config: d.Config,
  inMemoryFs: d.InMemoryFileSystem,
  opts: d.ResolveModuleIdOptions
) => {
  const packageJson = resolveRemotePackageJsonSync(config, inMemoryFs, opts.moduleId);
  if (packageJson) {
    const resolveModuleSyncOpts: d.ResolveModuleIdOptions = {
      ...opts,
      exts: ['.js', '.mjs'],
    };
    const resolvedUrl = resolveModuleIdSync(config.sys, inMemoryFs, resolveModuleSyncOpts);
    if (typeof resolvedUrl === 'string') {
      return {
        resolvedUrl,
        packageJson,
      };
    }
  }
  return null;
};

const resolveRemotePackageJsonSync = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string) => {
  if (inMemoryFs) {
    const filePath = normalizePath(
      config.sys.getLocalModulePath({ rootDir: config.rootDir, moduleId, path: 'package.json' })
    );
    let pkgJson = inMemoryFs.readFileSync(filePath);
    if (!isString(pkgJson) && IS_WEB_WORKER_ENV) {
      const url = config.sys.getRemoteModuleUrl({ moduleId, path: 'package.json' });
      pkgJson = fetchModuleSync(config.sys, inMemoryFs, packageVersions, url, filePath);
    }
    if (typeof pkgJson === 'string') {
      try {
        return JSON.parse(pkgJson) as d.PackageJsonData;
      } catch (e) {}
    }
  }
  return null;
};

export const resolveModuleIdSync = (
  sys: d.CompilerSystem,
  inMemoryFs: d.InMemoryFileSystem,
  opts: d.ResolveModuleIdOptions
) => {
  if (inMemoryFs) {
    const resolverOpts = createCustomResolverSync(sys, inMemoryFs, opts.exts);
    resolverOpts.basedir = dirname(opts.containingFile);
    resolverOpts.packageFilter = opts.packageFilter;

    const resolvedModule = resolve.sync(opts.moduleId, resolverOpts);
    return resolvedModule;
  }
  return null;
};

export const createCustomResolverSync = (
  sys: d.CompilerSystem,
  inMemoryFs: d.InMemoryFileSystem,
  exts: string[]
): SyncOpts => {
  return {
    isFile(filePath: string) {
      const fsFilePath = normalizeFsPath(filePath);

      const stat = inMemoryFs.statSync(fsFilePath);
      if (stat.isFile) {
        return true;
      }

      if (shouldFetchModule(fsFilePath)) {
        const endsWithExt = exts.some((ext) => fsFilePath.endsWith(ext));
        if (!endsWithExt) {
          return false;
        }

        const url = getNodeModuleFetchUrl(sys, packageVersions, fsFilePath);
        const content = fetchModuleSync(sys, inMemoryFs, packageVersions, url, fsFilePath);
        return typeof content === 'string';
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
        if (basename(fsDirPath) === 'node_modules') {
          // just the /node_modules directory
          inMemoryFs.sys.createDirSync(fsDirPath);
          inMemoryFs.clearFileCache(fsDirPath);
          return true;
        }

        if (isCommonDirModuleFile(fsDirPath)) {
          // don't bother seeing if it's a directory if it has a common file extension
          return false;
        }

        const checkFileExists = (fileName: string) => {
          const url = getCommonDirUrl(sys, packageVersions, fsDirPath, fileName);
          const filePath = getCommonDirName(fsDirPath, fileName);
          const content = fetchModuleSync(sys, inMemoryFs, packageVersions, url, filePath);
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

    realpathSync(p: string) {
      const fsFilePath = normalizeFsPath(p);
      try {
        return sys.realpathSync(fsFilePath);
      } catch (realpathErr: unknown) {
        if (isErrnoException(realpathErr)) {
          if (realpathErr.code !== 'ENOENT') {
            throw realpathErr;
          }
        }
      }
      return fsFilePath;
    },

    extensions: exts,
  } as any;
};

/**
 * Type guard to determine if an Error is an instance of `ErrnoException`. For the purposes of this type guard, we
 * must ensure that the `code` field is present. This type guard was written with the `ErrnoException` definition from
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d121716ed123957f6a86f8985eb013fcaddab345/types/node/globals.d.ts#L183-L188
 * in mind.
 * @param err the entity to check the type of
 * @returns true if the provided value is an instance of `ErrnoException`, `false` otherwise
 */
function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && err.hasOwnProperty('code');
}
