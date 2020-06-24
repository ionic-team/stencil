import * as d from '../../../declarations';
import { basename } from 'path';
import { promisify } from './util';

export interface FsObj {
  __sys: d.CompilerSystem;
  [key: string]: any;
}

class FsError extends Error {
  constructor(public syscall: string, public path: string, public code: string = 'ENOENT', public errno: number = -2) {
    super(`ENOENT: no such file or directory, ${syscall} '${path}'`);
  }
}

const fs: FsObj = {
  __sys: {} as any,
};

export const exists = (fs.exists = (p: string, cb: any) => {
  fs.__sys.access(p).then(hasAccess => {
    cb(hasAccess);
  }).catch(() => {
    cb(false);
  });
});

// https://nodejs.org/api/util.html#util_custom_promisified_functions
(exists as any)[promisify.custom] = (p: string) => fs.__sys.access(p);

export const existsSync = (fs.existsSync = (p: string) => {
  // https://nodejs.org/api/fs.html#fs_fs_existssync_path
  return fs.__sys.accessSync(p);
});

export const mkdir = (fs.mkdir = (p: string, opts: any, cb: any) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  opts = typeof opts === 'function' ? undefined : opts;
  fs.__sys.mkdir(p, opts).then(results => {
    if (cb) {
      if (results.error) {
        cb(new FsError('mkdir', p));
      } else {
        cb(null);
      }
    }
  }).catch(e => {
    cb && cb(e);
  });
});

export const mkdirSync = (fs.mkdirSync = (p: string, opts: any) => {
  const results = fs.__sys.mkdirSync(p, opts);
  if (results.error) {
    throw new FsError('mkdir', p);
  }
});

export const readdirSync = (fs.readdirSync = (p: string) => {
  // sys.readdirSync includes full paths
  // but if fs.readdirSync was called, the expected
  // nodejs results are of just the basename for each dir item
  const dirItems = fs.__sys.readdirSync(p);
  return dirItems.map(dirItem => basename(dirItem));
});

export const readFile = (fs.readFile = async (p: string, opts: any, cb: (err: any, data?: string) => void) => {
  const encoding = typeof opts === 'object' ? opts.encoding : typeof opts === 'string' ? opts : 'utf-8';
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.readFile(p, encoding).then(data => {
    if (cb) {
      if (typeof data === 'string') {
        cb(null, data);
      } else {
        cb(new FsError('open', p), data);
      }
    }
  }).catch(e => {
    cb && cb(e);
  });
});

export const readFileSync = (fs.readFileSync = (p: string, opts: any) => {
  const encoding = typeof opts === 'object' ? opts.encoding : typeof opts === 'string' ? opts : 'utf-8';
  const data = fs.__sys.readFileSync(p, encoding);
  if (typeof data !== 'string') {
    throw new FsError('open', p);
  }
  return data;
});

export const realpath = (fs.realpath = (p: string, opts: any, cb: (err: any, data?: string) => void) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.realpath(p).then(results => {
    if (cb) {
      cb(results.error, results.path);
    }
  }).catch(e => {
    cb(e);
  });
});

export const realpathSync = (fs.realpathSync = (p: string) => {
  const results = fs.__sys.realpathSync(p);
  if (results.error) {
    throw results.error;
  }
  return results.path;
});

export const statSync = (fs.statSync = (p: string) => {
  const fsStats = fs.__sys.statSync(p);
  if (!fsStats) {
    throw new FsError('statSync', p);
  }
  return fsStats;
});

export const lstatSync = (fs.lstatSync = statSync);

export const stat = (fs.stat = (p: string, opts: any, cb: any) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.stat(p).then(fsStats => {
    if (cb) {
      if (fsStats) {
        cb(null);
      } else {
        cb(new FsError('stat', p));
      }
    }
  }).catch(e => {
    cb && cb(e);
  });
});

export const watch = (fs.watch = () => {
  throw new Error(`fs.watch() not implemented`);
});

export const writeFile = (fs.writeFile = (p: string, data: string, opts: any, cb: any) => {
  cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
  fs.__sys.writeFile(p, data).then(writeResults => {
    if (cb) {
      if (writeResults.error) {
        cb(new FsError('writeFile', p));
      } else {
        cb(null);
      }
    }
  }).catch(e => {
    cb && cb(e);
  });
});

export default fs;
