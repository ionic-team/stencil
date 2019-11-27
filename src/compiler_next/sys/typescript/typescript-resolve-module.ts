import * as d from '../../../declarations';
import { compilerBuild } from '../../../version';
import { getStencilInternalDtsUrl } from '../fetch/fetch-utils';
import { isLocalModule, isRemoteUrlCompiler, isStencilCoreImport } from '../resolve/resolve-utils';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { resolveModuleIdSync, resolveRemotePackageJsonSync } from '../resolve/resolve-module';
import path from 'path';
import ts from 'typescript';


export const patchTypeScriptResolveModule = (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  const compilerExe = config.sys_next.getCompilerExecutingPath();

  if (shouldPatchRemoteTypeScript(compilerExe)) {
    const orgResolveModuleName = ts.resolveModuleName;

    ts.resolveModuleName = function (moduleName, containingFile, compilerOptions, host, cache, redirectedReference) {
      if (!isLocalModule(moduleName)) {

        if (isStencilCoreImport(moduleName)) {
          return {
            resolvedModule: {
              extension: ts.Extension.Dts,
              resolvedFileName: getStencilInternalDtsUrl(compilerExe),
              packageId: {
                name: moduleName,
                subModuleName: '',
                version: compilerBuild.stencilVersion
              }
            }
          };
        }

        const pkgJson = resolveRemotePackageJsonSync(config, inMemoryFs, moduleName);
        if (pkgJson) {
          const fromDir = path.dirname(containingFile);
          const id = resolveModuleIdSync(config, inMemoryFs, moduleName, fromDir, ['.js', '.mjs']);
          return {
            resolvedModule: {
              extension: ts.Extension.Js,
              resolvedFileName: id,
              packageId: {
                name: moduleName,
                subModuleName: '',
                version: pkgJson.version
              }
            }
          };
        }
      }
      return orgResolveModuleName(moduleName, containingFile, compilerOptions, host, cache, redirectedReference);
    };
  }

  return ts.resolveModuleName;
};

const shouldPatchRemoteTypeScript = (compilerExe: string) =>
  !IS_NODE_ENV && IS_WEB_WORKER_ENV && isRemoteUrlCompiler(compilerExe);
