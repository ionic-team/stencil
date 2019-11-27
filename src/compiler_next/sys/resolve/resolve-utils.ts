import * as d from '../../../declarations';

export const NODE_MODULES_FS_DIR = '/node_modules';
export const STENCIL_CORE_MODULE = NODE_MODULES_FS_DIR + '/@stencil/core/';
export const NODE_MODULES_CDN_URL = 'https://cdn.jsdelivr.net/npm';

const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];


export const getCommonDirName = (dirPath: string, fileName: string) => dirPath + '/' + fileName;

export const isCommonDirModuleFile = (p: string) => COMMON_DIR_MODULE_EXTS.some(ext => p.endsWith(ext));

export const setPackageVersion = (pkgVersions: Map<string, string>, pkgName: string, pkgVersion: string) => {
  pkgVersions.set('/' + pkgName + '/', pkgVersion);
};

export const setPackageVersionByContent = (pkgVersions: Map<string, string>, pkgContent: string) => {
  try {
    const pkg = JSON.parse(pkgContent) as d.PackageJsonData;
    if (pkg.name && pkg.version) {
      setPackageVersion(pkgVersions, pkg.name, pkg.version);
    }
  } catch (e) {}
};

export const isRemoteUrlCompiler = (compilerExe: string) =>
  compilerExe.startsWith('https://') || compilerExe.startsWith('http://');

export const getCdnPackageJsonUrl = (moduleId: string) => new URL(`./${moduleId}/package.json`, NODE_MODULES_CDN_URL).href;

export const isLocalModule = (p: string) => p.startsWith('.') || p.startsWith('/');

export const isStencilCoreImport = (p: string) => p.startsWith('@stencil/core');
