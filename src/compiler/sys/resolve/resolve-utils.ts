import * as d from '../../../declarations';
import { IS_FETCH_ENV, IS_NODE_ENV, normalizePath } from '@utils';
import { join } from 'path';

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

export const getNodeModulePath = (rootDir: string, ...pathParts: string[]) => normalizePath(join.apply(null, [rootDir, 'node_modules', ...pathParts]));

export const getStencilModulePath = (rootDir: string, ...pathParts: string[]) => getNodeModulePath(rootDir, '@stencil', 'core', ...pathParts);

export const getStencilInternalDtsPath = (rootDir: string) => getStencilModulePath(rootDir, 'internal', 'index.d.ts');

export const isLocalModule = (p: string) => p.startsWith('.') || p.startsWith('/');

export const isStencilCoreImport = (p: string) => p.startsWith('@stencil/core');

export const shouldFetchModule = (p: string) => IS_FETCH_ENV && !IS_NODE_ENV && isNodeModulePath(p);

export const isNodeModulePath = (p: string) =>
  normalizePath(p)
    .split('/')
    .includes('node_modules');

export const getPackageDirPath = (p: string, moduleId: string) => {
  const parts = normalizePath(p).split('/');
  for (let i = parts.length - 1; i >= 1; i--) {
    if (parts[i - 1] === 'node_modules' && parts[i] === moduleId) {
      return parts.slice(0, i + 1).join('/');
    }
  }
  return null;
};
