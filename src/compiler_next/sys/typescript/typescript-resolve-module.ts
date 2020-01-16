import * as d from '../../../declarations';
import { getStencilInternalDtsUrl } from '../fetch/fetch-utils';
import { isDtsFile, isExternalUrl, isJsFile, isJsxFile, isLocalModule, isStencilCoreImport, isTsxFile, isTsFile } from '../resolve/resolve-utils';
import { IS_LOCATION_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { isString } from '@utils';
import { resolveRemoteModuleId } from '../resolve/resolve-module';
import { version } from '../../../version';
import ts from 'typescript';
import path from 'path';


export const patchTypeScriptResolveModule = (loadedTs: typeof ts, config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  let compilerExe: string;
  if (config.sys_next) {
    compilerExe = config.sys_next.getCompilerExecutingPath();
  } else if (IS_LOCATION_ENV) {
    compilerExe = location.href;
  }

  if (shouldPatchRemoteTypeScript(compilerExe)) {
    const orgResolveModule = loadedTs.resolveModuleName;

    loadedTs.resolveModuleName = (moduleName, containingFile, compilerOptions, host, cache, redirectedReference) => {
      const resolvedModule = tsResolveModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
      if (resolvedModule) {
        return resolvedModule;
      }
      return orgResolveModule(moduleName, containingFile, compilerOptions, host, cache, redirectedReference);
    };
  }
};

export const tsResolveModule = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, compilerExe: string, moduleName: string, containingFile: string): ts.ResolvedModuleWithFailedLookupLocations => {
  if (isLocalModule(moduleName)) {
    // local file

    if (isExternalUrl(containingFile)) {
      // containing file is a
      let resolvedUrl = new URL(moduleName, containingFile).href;
      resolvedUrl = ensureUrlExtension(resolvedUrl, containingFile);

      return {
        resolvedModule: {
          extension: getTsResolveExtension(resolvedUrl),
          resolvedFileName: resolvedUrl,
          packageId: {
            name: moduleName,
            subModuleName: '',
            version,
          }
        }
      };
    }

  } else {
    // node module id
    return tsResolveNodeModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
  }

  return null;
};

const tsResolveNodeModule = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, compilerExe: string, moduleName: string, containingFile: string): ts.ResolvedModuleWithFailedLookupLocations => {
  if (isStencilCoreImport(moduleName)) {
    return {
      resolvedModule: {
        extension: ts.Extension.Dts,
        resolvedFileName: getStencilInternalDtsUrl(compilerExe),
        packageId: {
          name: moduleName,
          subModuleName: '',
          version,
        }
      }
    };
  }

  const resolved = resolveRemoteModuleId(config, inMemoryFs, moduleName, containingFile);
  if (resolved) {
    return {
      resolvedModule: {
        extension: ts.Extension.Js,
        resolvedFileName: resolved.resolvedUrl,
        packageId: {
          name: moduleName,
          subModuleName: '',
          version: resolved.packageJson.version,
        }
      }
    };
  }

  return null;
}

export const ensureUrlExtension = (url: string, containingUrl: string) => {
  const fileName = path.basename(url);

  if (!fileName.includes('.') && isString(containingUrl)) {
    containingUrl = containingUrl.toLowerCase();
    if (isJsFile(containingUrl)) {
      url += '.js';
    } else if (isDtsFile(containingUrl)) {
      url += '.d.ts';
    } else if (isTsxFile(containingUrl)) {
      url += '.tsx';
    } else if (isTsFile(containingUrl)) {
      url += '.ts';
    } else if (isJsxFile(containingUrl)) {
      url += '.jsx';
    }
  }

  return url;
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
  return ts.Extension.Ts;
};

const shouldPatchRemoteTypeScript = (compilerExe: string) =>
  !IS_NODE_ENV && IS_WEB_WORKER_ENV && isExternalUrl(compilerExe);
