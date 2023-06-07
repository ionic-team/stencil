<<<<<<< HEAD
import { isString, normalizePath } from '@utils';
import { basename, dirname, isAbsolute, join, resolve } from 'path';
||||||| parent of aec096984 (starting this)
import { isRemoteUrl, isString, normalizePath } from '@utils';
import { basename, dirname, isAbsolute, join, resolve } from 'path';
=======
import { normalizePath } from '@utils';
import { dirname, join, resolve } from 'path';
>>>>>>> aec096984 (starting this)
import ts from 'typescript';

import type * as d from '../../../declarations';
<<<<<<< HEAD
import { version } from '../../../version';
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
||||||| parent of aec096984 (starting this)
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
=======
>>>>>>> aec096984 (starting this)
import { patchTsSystemFileSystem } from './typescript-sys';

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



<<<<<<< HEAD
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
||||||| parent of aec096984 (starting this)
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
=======
>>>>>>> aec096984 (starting this)
