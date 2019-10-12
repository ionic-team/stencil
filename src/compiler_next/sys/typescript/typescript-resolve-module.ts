import * as d from '../../../declarations';
import { compilerBuild } from '../../../version';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from '../environment';
import { resolveModuleIdSync, resolveRemotePackageJsonSync } from '../resolve-module';
import ts from 'typescript';


export const patchTypeScriptResolveModule = (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  const compilerPath = config.sys_next.getCompilerExecutingPath();

  if (!IS_NODE_ENV && IS_WEB_WORKER_ENV && compilerPath.startsWith('http') && inMemoryFs) {
    const orgResolveModuleName = ts.resolveModuleName;

    ts.resolveModuleName = function (moduleName, containingFile, compilerOptions, host, cache, redirectedReference) {
      if (!moduleName.startsWith('.') && !moduleName.startsWith('/')) {

        if (moduleName === '@stencil/core' || moduleName === '@stencil/core/internal') {
          const stencilCoreRoot = new URL('../', compilerPath).href;
          return {
            resolvedModule: {
              extension: ts.Extension.Dts,
              resolvedFileName: new URL('./internal/index.d.ts', stencilCoreRoot).href,
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
          const id = resolveModuleIdSync(config, inMemoryFs, moduleName, containingFile, ['.js', '.mjs']);
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
