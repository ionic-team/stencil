import { isRemoteUrl, isString, normalizePath } from '@utils';
import { basename, dirname, isAbsolute, join, resolve } from 'path';
import ts from 'typescript';

import type * as d from '../../../declarations';
import { version } from '../../../version';
import { IS_BROWSER_ENV, IS_NODE_ENV } from '../environment';
import { InMemoryFileSystem } from '../in-memory-fs';
import { resolveRemoteModuleIdSync } from '../resolve/resolve-module-sync';
import {
  isDtsFile,
  isJsFile,
  isJsonFile,
  isJsxFile,
  isLocalModule,
  isStencilCoreImport,
  isTsFile,
  isTsxFile,
} from '../resolve/resolve-utils';
import { patchTsSystemFileSystem } from './typescript-sys';

// TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
export const patchTypeScriptResolveModule = (config: d.Config, inMemoryFs: InMemoryFileSystem) => {
  let compilerExe: string;
  if (config.sys) {
    compilerExe = config.sys.getCompilerExecutingPath();
  } else if (IS_BROWSER_ENV) {
    compilerExe = location.href;
  }

  if (shouldPatchRemoteTypeScript(compilerExe)) {
    const resolveModuleName = ((ts as any).__resolveModuleName = ts.resolveModuleName);

    ts.resolveModuleName = (moduleName, containingFile, compilerOptions, host, cache, redirectedReference) => {
      const resolvedModule = patchedTsResolveModule(config, inMemoryFs, moduleName, containingFile);
      if (resolvedModule) {
        return resolvedModule;
      }
      return resolveModuleName(moduleName, containingFile, compilerOptions, host, cache, redirectedReference);
    };
  }
};

export const tsResolveModuleName = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  moduleName: string,
  containingFile: string
) => {
  const resolveModuleName: typeof ts.resolveModuleName = (ts as any).__resolveModuleName || ts.resolveModuleName;

  if (moduleName && resolveModuleName && config.tsCompilerOptions) {
    const host: ts.ModuleResolutionHost = patchTsSystemFileSystem(config, config.sys, compilerCtx.fs, ts.sys);

    const compilerOptions: ts.CompilerOptions = { ...config.tsCompilerOptions };
    compilerOptions.resolveJsonModule = true;
    return resolveModuleName(moduleName, containingFile, compilerOptions, host);
  }

  return null;
};

export const tsResolveModuleNamePackageJsonPath = (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  moduleName: string,
  containingFile: string
) => {
  try {
    const resolvedModule = tsResolveModuleName(config, compilerCtx, moduleName, containingFile);
    if (resolvedModule && resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName) {
      const rootDir = resolve('/');
      let resolvedFileName = resolvedModule.resolvedModule.resolvedFileName;

      for (let i = 0; i < 30; i++) {
        if (rootDir === resolvedFileName) {
          return null;
        }
        resolvedFileName = dirname(resolvedFileName);
        const pkgJsonPath = join(resolvedFileName, 'package.json');
        const exists = config.sys.accessSync(pkgJsonPath);
        if (exists) {
          return normalizePath(pkgJsonPath);
        }
      }
    }
  } catch (e) {
    config.logger.error(e);
  }
  return null;
};

export const patchedTsResolveModule = (
  config: d.Config,
  inMemoryFs: InMemoryFileSystem,
  moduleName: string,
  containingFile: string
): ts.ResolvedModuleWithFailedLookupLocations => {
  if (isLocalModule(moduleName)) {
    const containingDir = dirname(containingFile);
    let resolvedFileName = join(containingDir, moduleName);
    resolvedFileName = normalizePath(ensureExtension(resolvedFileName, containingFile));

    // In some cases `inMemoryFs` will not be defined here, so we should use
    // `accessSync` on `config.sys` instead. This is because this function is
    // called by `patchTypeScriptResolveModule` which is then in turn called by
    // `patchTypescript`. If you check out that function it takes an
    // `InMemoryFileSystem` as its second parameter:
    //
    // https://github.com/ionic-team/stencil/blob/5b4bb06a4d0369c09aeb63b1a626ff8df9464117/src/compiler/sys/typescript/typescript-sys.ts#L165-L175
    //
    // but if you look at its call sites there are a few where we pass `null`
    // instead, eg:
    //
    // https://github.com/ionic-team/stencil/blob/5b4bb06a4d0369c09aeb63b1a626ff8df9464117/src/compiler/transpile.ts#L42-L44
    //
    // so in short the type for `inMemoryFs` here is not accurate, so we need
    // to add a runtime check here to avoid an error.
    //
    // TODO(STENCIL-728): fix typing of `inMemoryFs` parameter in `patchTypescript`, related functions
    const accessSync = inMemoryFs?.accessSync ?? config.sys.accessSync;
    if (isAbsolute(resolvedFileName) && !accessSync(resolvedFileName)) {
      return null;
    }

    if (!isAbsolute(resolvedFileName) && !resolvedFileName.startsWith('.') && !resolvedFileName.startsWith('/')) {
      resolvedFileName = './' + resolvedFileName;
    }

    const rtn: ts.ResolvedModuleWithFailedLookupLocations = {
      resolvedModule: {
        extension: getTsResolveExtension(resolvedFileName),
        resolvedFileName,
        packageId: {
          name: moduleName,
          subModuleName: '',
          version,
        },
      },
    };
    (rtn as any).failedLookupLocations = [];

    return rtn;
  }

  // node module id
  return tsResolveNodeModule(config, inMemoryFs, moduleName, containingFile);
};

export const tsResolveNodeModule = (
  config: d.Config,
  inMemoryFs: InMemoryFileSystem,
  moduleId: string,
  containingFile: string
): ts.ResolvedModuleWithFailedLookupLocations => {
  if (isStencilCoreImport(moduleId)) {
    const rtn: ts.ResolvedModuleWithFailedLookupLocations = {
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: normalizePath(
          config.sys.getLocalModulePath({
            rootDir: config.rootDir,
            moduleId: '@stencil/core',
            path: 'internal/index.d.ts',
          })
        ),
        packageId: {
          name: moduleId,
          subModuleName: '',
          version,
        },
      },
    };
    (rtn as any).failedLookupLocations = [];
    return rtn;
  }

  const resolved = resolveRemoteModuleIdSync(config, inMemoryFs, {
    moduleId,
    containingFile,
  });
  if (resolved) {
    const rtn: ts.ResolvedModuleWithFailedLookupLocations = {
      resolvedModule: {
        extension: ts.Extension.Js,
        resolvedFileName: resolved.resolvedUrl,
        packageId: {
          name: moduleId,
          subModuleName: '',
          version: resolved.packageJson.version,
        },
      },
    };
    (rtn as any).failedLookupLocations = [];
    return rtn;
  }

  return null;
};

export const ensureExtension = (fileName: string, containingFile: string) => {
  if (!basename(fileName).includes('.') && isString(containingFile)) {
    containingFile = containingFile.toLowerCase();
    if (isJsFile(containingFile)) {
      fileName += '.js';
    } else if (isDtsFile(containingFile)) {
      fileName += '.d.ts';
    } else if (isTsxFile(containingFile)) {
      fileName += '.tsx';
    } else if (isTsFile(containingFile)) {
      fileName += '.ts';
    } else if (isJsxFile(containingFile)) {
      fileName += '.jsx';
    }
  }

  return fileName;
};

const getTsResolveExtension = (p: string) => {
  if (isDtsFile(p)) {
    return ts.Extension.Dts;
  }
  if (isTsxFile(p)) {
    return ts.Extension.Tsx;
  }
  if (isJsFile(p)) {
    return ts.Extension.Js;
  }
  if (isJsxFile(p)) {
    return ts.Extension.Jsx;
  }
  if (isJsonFile(p)) {
    return ts.Extension.Json;
  }
  return ts.Extension.Ts;
};

const shouldPatchRemoteTypeScript = (compilerExe: string) => !IS_NODE_ENV && isRemoteUrl(compilerExe);
