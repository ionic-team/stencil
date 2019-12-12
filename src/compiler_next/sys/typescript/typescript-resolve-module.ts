import * as d from '../../../declarations';
import { compilerBuild } from '../../../version';
import { getStencilInternalDtsUrl } from '../fetch/fetch-utils';
import { isLocalModule, isRemoteUrlCompiler, isStencilCoreImport } from '../resolve/resolve-utils';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { resolveRemoteModuleId } from '../resolve/resolve-module';
import ts from 'typescript';


export const patchTypeScriptResolveModule = (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  const compilerExe = config.sys_next.getCompilerExecutingPath();

  if (shouldPatchRemoteTypeScript(compilerExe)) {
    const orgResolveModuleName = ts.resolveModuleName;

    ts.resolveModuleName = function (moduleName, containingFile, compilerOptions, host, cache, redirectedReference) {
      const resolvedModule = tsRemoteResolveModule(config, inMemoryFs, compilerExe, moduleName, containingFile);
      if (resolvedModule) {
        return resolvedModule;
      }
      return orgResolveModuleName(moduleName, containingFile, compilerOptions, host, cache, redirectedReference);
    };
  }

  return ts.resolveModuleName;
};

export const tsRemoteResolveModule = (config: d.Config, inMemoryFs: d.InMemoryFileSystem, compilerExe: string, moduleName: string, containingFile: string): ts.ResolvedModuleWithFailedLookupLocations => {
  if (isLocalModule(moduleName)) {
    // local file

    const stencilInternalDtsUrl = getStencilInternalDtsUrl(compilerExe);
    if (stencilInternalDtsUrl === containingFile) {
      let dtsUrl = new URL(moduleName, containingFile).href;
      if (!dtsUrl.endsWith('.d.ts')) {
        dtsUrl += '.d.ts';
      }
      return {
        resolvedModule: {
          extension: ts.Extension.Dts,
          resolvedFileName: dtsUrl,
          packageId: {
            name: moduleName,
            subModuleName: '',
            version: compilerBuild.stencilVersion,
          }
        }
      };
    }

  } else {
    // node module id

    if (isStencilCoreImport(moduleName)) {
      return {
        resolvedModule: {
          extension: ts.Extension.Dts,
          resolvedFileName: getStencilInternalDtsUrl(compilerExe),
          packageId: {
            name: moduleName,
            subModuleName: '',
            version: compilerBuild.stencilVersion,
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
  }

  return null;
};

const shouldPatchRemoteTypeScript = (compilerExe: string) =>
  !IS_NODE_ENV && IS_WEB_WORKER_ENV && isRemoteUrlCompiler(compilerExe);
