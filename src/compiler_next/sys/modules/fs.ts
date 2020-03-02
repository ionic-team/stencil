import * as d from '../../../declarations';
import { basename } from 'path';
import { promisify } from './util';


export interface FsObj {
  __sys: d.CompilerSystem;
  [key: string]: any;
}

const fs: FsObj = {
  __sys: {} as any
};

export const exists = fs.exists = (p: string, cb: any) => {
  fs.__sys.access(p).then(hasAccess => {
    cb(hasAccess);
  });
};

// https://nodejs.org/api/util.html#util_custom_promisified_functions
(exists as any)[promisify.custom] = (p: string) => fs.__sys.access(p);

export const existsSync = fs.existsSync = (p: string) => {
  const exists = fs.__sys.accessSync(p);
  if (!exists) {
    throw new Error(`fs.existsSync not found: ${p}`);
  }
  return exists;
};

export const mkdirSync = fs.mkdirSync = (p: string) => fs.__sys.mkdirSync(p);

export const readdirSync = fs.readdirSync = (p: string) => {
  // sys.readdirSync includes full paths
  // but if fs.readdirSync was called, the expected
  // nodejs results are of just the basename for each dir item
  const dirItems = fs.__sys.readdirSync(p);
  return dirItems.map(dirItem => basename(dirItem));
};

export const readFile = fs.readFile = async (p: string, opts: any, cb: (err: any, data: string) => void) => {
  const encoding = typeof opts === 'object' ? opts.encoding : typeof opts === 'string' ? opts : 'utf-8';
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.readFile(p, encoding).then(data => {
    if (cb) {
      if (typeof data === 'string') {
        cb(null, data);
      } else {
        cb(`fs.readFile error: ${p}`, data);
      }
    }
  });
};

export const realpath = fs.realpath = (p: string, opts: any, cb: (err: any, data: string) => void) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.realpath(p).then(data => {
    if (cb) {
      if (typeof data === 'string') {
        cb(null, data);
      } else {
        cb(`fs.realpath error: ${p}`, data);
      }
    }
  });
};

export const realpathSync = fs.realpathSync = (p: string) => {
  const data = fs.__sys.realpathSync(p);
  if (!data) {
    throw new Error(`fs.realpathSync not found: ${p}`);
  }
  return data;
};

export const statSync = fs.statSync = (p: string) => {
  const s = fs.__sys.statSync(p);
  if (!s) {
    throw new Error(`fs.statSync not found: ${p}`);
  }
  return s;
};

export const lstatSync = fs.lstatSync = statSync;

export const stat = fs.stat = (p: string, opts: any, cb: any) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.stat(p).then(success => {
    if (cb) {
      if (success) {
        cb(null);
      } else {
        cb(`fs.stat error: ${p}`);
      }
    }
  });
};

export const watch = fs.watch = () => {
  throw new Error(`fs.watch() not implemented`);
};

export const writeFile = fs.writeFile = (p: string, data: string, opts: any, cb: any) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.writeFile(p, data).then(success => {
    if (cb) {
      if (success) {
        cb(null);
      } else {
        cb(`fs.writeFile error: ${p}`);
      }
    }
  });
};


export default fs;
