import type * as d from '../../../declarations';
import { IS_NODE_ENV, requireFunc } from '../environment';
import { normalizePath } from '@utils';
import pathBrowserify from 'path-browserify';

export let basename: any;
export let dirname: any;
export let extname: any;
export let isAbsolute: any;
export let join: any;
export let normalize: any;
export let parse: any;
export let relative: any;
export let resolve: any;
export let sep: any;
export let delimiter: any;
export let posix: any;
export let win32: any;

export const path: d.PlatformPath = {} as any;

export const setPlatformPath = (platformPath: d.PlatformPath) => {
  if (!platformPath) {
    platformPath = pathBrowserify;
  }

  Object.assign(path, platformPath);

  const normalizeOrg = path.normalize;
  const joinOrg = path.join;
  const relativeOrg = path.relative;
  const resolveOrg = path.resolve;

  normalize = path.normalize = (...args: string[]) => normalizePath(normalizeOrg.apply(path, args));
  join = path.join = (...args: string[]) => normalizePath(joinOrg.apply(path, args));
  relative = path.relative = (...args: string[]) => normalizePath(relativeOrg.apply(path, args));
  resolve = path.resolve = (...args: string[]) => normalizePath(resolveOrg.apply(path, args));

  basename = path.basename;
  dirname = path.dirname;
  extname = path.extname;
  isAbsolute = path.isAbsolute;
  parse = path.parse;
  sep = path.sep;
  delimiter = path.delimiter;
  posix = path.posix;
  if (path.win32) {
    win32 = path.win32;
  } else {
    win32 = { ...posix };
    win32.sep = '\\';
  }
};

setPlatformPath(IS_NODE_ENV ? requireFunc('path') : pathBrowserify);

export default path;
