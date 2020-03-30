import * as d from '../../../declarations';
import { IS_FETCH_ENV, IS_NODE_ENV, isFunction, isString, normalizePath } from '@utils';

export const NODE_MODULES_URL = 'https://cdn.jsdelivr.net/npm/';

const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];

export const COMMON_DIR_FILENAMES = ['package.json', 'index.js', 'index.mjs'];

export const isDtsFile = (p: string) => p.endsWith('.d.ts');

export const isTsFile = (p: string) => !isDtsFile(p) && p.endsWith('.ts');

export const isTsxFile = (p: string) => p.endsWith('.tsx');

export const isJsxFile = (p: string) => p.endsWith('.jsx');

export const isJsFile = (p: string) => p.endsWith('.js');

export const isMjsFile = (p: string) => p.endsWith('.mjs');

export const isJsonFile = (p: string) => p.endsWith('.json');

export const getCommonDirName = (dirPath: string, fileName: string) => dirPath + '/' + fileName;

export const isCommonDirModuleFile = (p: string) => COMMON_DIR_MODULE_EXTS.some(ext => p.endsWith(ext));

export const setPackageVersion = (pkgVersions: Map<string, string>, pkgName: string, pkgVersion: string) => {
  pkgVersions.set(pkgName, pkgVersion);
};

export const setPackageVersionByContent = (pkgVersions: Map<string, string>, pkgContent: string) => {
  try {
    const pkg = JSON.parse(pkgContent) as d.PackageJsonData;
    if (pkg.name && pkg.version) {
      setPackageVersion(pkgVersions, pkg.name, pkg.version);
    }
  } catch (e) {}
};

export const isExternalUrl = (p: string) => {
  if (isString(p)) {
    p = p.toLowerCase();
    return p.startsWith('https://') || p.startsWith('http://');
  }
  return false;
};

export const getRemoteModuleUrl = (sys: d.CompilerSystem, module: { moduleId: string; path: string; version?: string }) => {
  if (sys && isFunction(sys.getRemoteModuleUrl)) {
    return sys.getRemoteModuleUrl(module);
  }
  const path = `${module.moduleId}${module.version ? '@' + module.version : ''}/${module.path}`;
  return new URL(path, NODE_MODULES_URL).href;
};

export const getCdnPackageJsonUrl = (sys: d.CompilerSystem, moduleId: string) => {
  return getRemoteModuleUrl(sys, {
    moduleId,
    path: `package.json`,
  });
};

export const isLocalModule = (p: string) => p.startsWith('.') || p.startsWith('/');

export const isStencilCoreImport = (p: string) => p.startsWith('@stencil/core');

export const shouldFetchModule = (p: string) => IS_FETCH_ENV && !IS_NODE_ENV && isNodeModulePath(p);

export const isNodeModulePath = (p: string) => {
  const parts = normalizePath(p).split('/');
  return parts.includes('node_modules');
};
