import * as d from '../../../declarations';
import { isFunction, normalizePath } from '@utils';
import { NODE_MODULES_CDN_URL, NODE_MODULES_FS_DIR, STENCIL_CORE_MODULE, isCommonDirModuleFile, isTsFile, isTsxFile } from '../resolve/resolve-utils';

export const httpFetch = (sys: d.CompilerSystem, input: RequestInfo, init?: RequestInit) => {
  if (sys && isFunction(sys.fetch)) {
    return sys.fetch(input, init);
  }
  return fetch(input, init);
};

export const packageVersions = new Map<string, string>();
export const known404Urls = new Set<string>();

export const getStencilRootUrl = (compilerExe: string) => new URL('../', compilerExe).href;

export const getStencilModuleUrl = (compilerExe: string, p: string) => {
  p = p.replace(STENCIL_CORE_MODULE, '');
  return new URL('./' + p, getStencilRootUrl(compilerExe)).href;
};

export const getStencilInternalDtsUrl = (compilerExe: string) => getStencilModuleUrl(compilerExe, 'internal/index.d.ts');

export const getCommonDirUrl = (compilerExe: string, pkgVersions: Map<string, string>, dirPath: string, fileName: string) =>
  getNodeModuleFetchUrl(compilerExe, pkgVersions, dirPath) + '/' + fileName;

export const getNodeModuleFetchUrl = (compilerExe: string, pkgVersions: Map<string, string>, filePath: string) => {
  if (filePath.startsWith(STENCIL_CORE_MODULE)) {
    // /node_modules/@stencil/core/package.json
    return getStencilModuleUrl(compilerExe, filePath);
  }

  // /node_modules/lodash/package.json
  const pathParts = normalizePath(filePath)
    .split('/')
    .filter(p => p.length);
  // ["node_modules", "lodash", "package.json"]

  if (pathParts[0] === 'node_modules') {
    // ["lodash", "package.json"]
    pathParts.shift();
  }

  let urlPath = filePath.replace(NODE_MODULES_FS_DIR + '/', '/');
  const checkScopedModule = `/${pathParts[0]}/${pathParts[1]}/`;
  const scopedPkgVersion = pkgVersions.get(checkScopedModule);
  if (scopedPkgVersion) {
    urlPath = urlPath.replace(checkScopedModule, checkScopedModule.substring(0, checkScopedModule.length - 1) + '@' + scopedPkgVersion + '/');
  } else {
    const checkModule = `/${pathParts[0]}/`;
    const pkgVersion = pkgVersions.get(checkModule);
    if (pkgVersion) {
      urlPath = urlPath.replace(checkModule, checkModule.substring(0, checkModule.length - 1) + '@' + pkgVersion + '/');
    }
  }

  return NODE_MODULES_CDN_URL + urlPath;
};

export const skipFilePathFetch = (filePath: string) => {
  if (isTsFile(filePath) || isTsxFile(filePath)) {
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

export const skipUrlFetch = (url: string) =>
  // files we just already know not to try to resolve request
  knownUrlSkips.some(knownSkip => url.endsWith(knownSkip));

const knownUrlSkips = [
  '/@stencil/core/internal.js',
  '/@stencil/core/internal.json',
  '/@stencil/core/internal.mjs',
  '/@stencil/core/internal/stencil-core.js/index.json',
  '/@stencil/core/internal/stencil-core.js.json',
  '/@stencil/core/internal/stencil-core.js/package.json',
  '/@stencil/core.js',
  '/@stencil/core.json',
  '/@stencil/core.mjs',
  '/@stencil/core.css',
  '/@stencil/core/index.js',
  '/@stencil/core/index.json',
  '/@stencil/core/index.mjs',
  '/@stencil/core/index.css',
  '/@stencil/package.json',
];
