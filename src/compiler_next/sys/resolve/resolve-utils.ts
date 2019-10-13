import * as d from '../../../declarations';
import { normalizePath } from '@utils';


export const getCommonDirUrl = (compilerExecutingPath: string, pkgVersions: Map<string, string>, dirPath: string, fileName: string) =>
   getNodeModuleFetchUrl(compilerExecutingPath, pkgVersions, dirPath) + '/' + fileName;

export const getCommonDirName = (dirPath: string, fileName: string) => dirPath + '/' + fileName;

const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];

export const isCommonDirModuleFile = (p: string) => COMMON_DIR_MODULE_EXTS.some(ext => p.endsWith(ext));

export const skipFilePathFetch = (filePath: string) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    // don't bother trying to resolve  node_module packages w/ typescript files
    // they should already be .js files
    return true;
  }

  const pathParts = filePath.split('/');
  const secondToLast = pathParts[pathParts.length - 2];
  const lastPart = pathParts[pathParts.length - 1];
  if (secondToLast === 'node_modules' && isCommonDirModuleFile(lastPart)) {
    // /node_modules/index.js
    // /node_modules/lodash.js
    // we just already know this is bogus, so don't bother
    return true;
  }

  return false;
};

export const skipUrlFetch = (url: string) => {
  // files we just already know not to try to resolve request
  return (knownUrlSkips.some(knownSkip => url.endsWith(knownSkip)));
};

export const setPkgVersion = (pkgContent: string, pkgVersions: Map<string, string>) => {
  try {
    const pkgData = JSON.parse(pkgContent) as d.PackageJsonData;
    if (pkgData.name && pkgData.version) {
      pkgVersions.set('/' + pkgData.name + '/', pkgData.version);
    }
  } catch (e) {}
};

export const getNodeModuleFetchUrl = (compilerExecutingPath: string, pkgVersions: Map<string, string>, filePath: string) => {
  if (filePath.startsWith(STENCIL_CORE_MODULE)) {
    // /node_modules/@stencil/core/package.json
    return getStencilModuleUrl(compilerExecutingPath, filePath);
  }

  // /node_modules/lodash/package.json
  const pathParts = normalizePath(filePath).split('/').filter(p => p.length);
  // ["node_modules", "lodash", "package.json"]

  if (pathParts[0] === 'node_modules') {
    // ["lodash", "package.json"]
    pathParts.shift();
  }

  let urlPath = filePath.replace(NODE_MODULES_FS_DIR + '/', '/');
  const checkScopedModule = `/${pathParts[0]}/${pathParts[1]}/`;
  const scopedPkgVersion = pkgVersions.get(checkScopedModule);
  if (scopedPkgVersion) {
    urlPath = urlPath.replace(
      checkScopedModule,
      checkScopedModule.substring(0, checkScopedModule.length - 1) + '@' + scopedPkgVersion + '/'
    );
  } else {
    const checkModule = `/${pathParts[0]}/`;
    const pkgVersion = pkgVersions.get(checkModule);
    if (pkgVersion) {
      urlPath = urlPath.replace(
        checkModule,
        checkModule.substring(0, checkModule.length - 1) + '@' + pkgVersion + '/'
      );
    }
  }

  return NODE_MODULES_CDN_URL + urlPath;
};

export const getStencilModuleUrl = (compilerExecutingPath: string, p: string) => {
  p = p.replace(STENCIL_CORE_MODULE, '');
  const stencilCoreUrlRoot = new URL('../', compilerExecutingPath).href;
  return new URL('./' + p, stencilCoreUrlRoot).href;
};

export const getStencilModulePath = (p: string) =>
  // when setting the stencil core prefix to /node_modules/@stencil/core
  // then the node resolver knows to change the path to a url to request
  STENCIL_CORE_MODULE + p;

export const isRemoteUrlCompiler = (compilerExe: string) =>
  compilerExe.startsWith('https://') || compilerExe.startsWith('http://');

export const NODE_MODULES_FS_DIR = '/node_modules';
const STENCIL_CORE_MODULE = NODE_MODULES_FS_DIR + '/@stencil/core/';
const NODE_MODULES_CDN_URL = 'https://cdn.jsdelivr.net/npm';

export const getCdnPackageJsonUrl = (moduleId: string) => new URL(`./${moduleId}/package.json`, NODE_MODULES_CDN_URL).href;

const knownUrlSkips = [
  '/@stencil/core/internal.mjs',
  '/@stencil/core/internal.js',
  '/@stencil/core/internal.json',
];
