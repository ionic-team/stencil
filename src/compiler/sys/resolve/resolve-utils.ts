import * as d from '../../../declarations';
import { IS_FETCH_ENV, IS_NODE_ENV, isString } from '@utils';

export const NODE_MODULES_FS_DIR = '/node_modules';
export const STENCIL_CORE_MODULE = NODE_MODULES_FS_DIR + '/@stencil/core/';
export const NODE_MODULES_CDN_URL = 'https://cdn.jsdelivr.net/npm';

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

export const isExternalUrl = (p: string) => {
  if (isString(p)) {
    p = p.toLowerCase();
    return p.startsWith('https://') || p.startsWith('http://');
  }
  return false;
};

export const getCdnPackageJsonUrl = (moduleId: string) => new URL(`./${moduleId}/package.json`, NODE_MODULES_CDN_URL).href;

export const isLocalModule = (p: string) => p.startsWith('.') || p.startsWith('/');

export const isStencilCoreImport = (p: string) => p.startsWith('@stencil/core');

export const shouldFetchModule = (p: string) => IS_FETCH_ENV && !IS_NODE_ENV && p.startsWith(NODE_MODULES_FS_DIR + '/');
