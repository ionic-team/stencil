import fs from 'graceful-fs';
import path from 'path';
import { normalizePath } from '../../compiler/util';


export class NodeResolveModule {
  private resolveModuleCache = new Map<string, string>();

  resolveModule(fromDir: string, moduleId: string) {
    const cacheKey = `${fromDir}:${moduleId}`;

    const cachedPath = this.resolveModuleCache.get(cacheKey);
    if (cachedPath) {
      return cachedPath;
    }

    if (moduleId.startsWith('@types/')) {
      return this.resolveTypesModule(fromDir, moduleId, cacheKey);
    }

    const Module = require('module');

    fromDir = path.resolve(fromDir);
    const fromFile = path.join(fromDir, 'noop.js');

    let dir = normalizePath(Module._resolveFilename(moduleId, {
      id: fromFile,
      filename: fromFile,
      paths: Module._nodeModulePaths(fromDir)
    }));

    const root = normalizePath(path.parse(fromDir).root);
    let packageJsonFilePath: string;

    while (dir !== root) {
      dir = normalizePath(path.dirname(dir));
      packageJsonFilePath = path.join(dir, 'package.json');

      if (!hasAccess(packageJsonFilePath)) {
        continue;
      }

      this.resolveModuleCache.set(cacheKey, packageJsonFilePath);

      return packageJsonFilePath;
    }

    throw new Error(`error loading "${moduleId}" from "${fromDir}"`);
  }

  resolveTypesModule(fromDir: string, moduleId: string, cacheKey: string) {
    const moduleSplt = moduleId.split('/');

    const root = normalizePath(path.parse(fromDir).root);

    let dir = normalizePath(path.join(fromDir, 'noop.js'));
    let typesPackageJsonFilePath: string;

    while (dir !== root) {
      dir = normalizePath(path.dirname(dir));
      typesPackageJsonFilePath = path.join(dir, 'node_modules', moduleSplt[0], moduleSplt[1], 'package.json');

      if (!hasAccess(typesPackageJsonFilePath)) {
        continue;
      }

      this.resolveModuleCache.set(cacheKey, typesPackageJsonFilePath);

      return typesPackageJsonFilePath;
    }

    throw new Error(`error loading "${moduleId}" from "${fromDir}"`);
  }

}

function hasAccess(filePath: string) {
  let access = false;
  try {
    fs.accessSync(filePath);
    access = true;
  } catch (e) {}
  return access;
}
