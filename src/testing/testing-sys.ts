import { createSystem } from '../compiler/sys/stencil-sys';
import { createHash } from 'crypto';

export const createTestingSystem = () => {
  let diskReads = 0;
  let diskWrites = 0;
  const sys = createSystem();

  sys.generateContentHash = (content, length) => {
    let hash = createHash('sha1')
      .update(content)
      .digest('hex')
      .toLowerCase();

    if (typeof length === 'number') {
      hash = hash.substr(0, length);
    }
    return Promise.resolve(hash);
  };

  const wrapRead = (fn: any) => {
    const orgFn = fn;
    return (...args: any[]) => {
      diskReads++;
      return orgFn.apply(orgFn, args);
    };
  };

  const wrapWrite = (fn: any) => {
    const orgFn = fn;
    return (...args: any[]) => {
      diskWrites++;
      return orgFn.apply(orgFn, args);
    };
  };

  sys.access = wrapRead(sys.access);
  sys.accessSync = wrapRead(sys.accessSync);
  sys.readFile = wrapRead(sys.readFile);
  sys.readFileSync = wrapRead(sys.readFileSync);
  sys.readdir = wrapRead(sys.readdir);
  sys.readdirSync = wrapRead(sys.readdirSync);
  sys.stat = wrapRead(sys.stat);
  sys.statSync = wrapRead(sys.statSync);

  sys.copyFile = wrapWrite(sys.copyFile);
  sys.mkdir = wrapWrite(sys.mkdir);
  sys.mkdirSync = wrapWrite(sys.mkdirSync);
  sys.unlink = wrapWrite(sys.unlink);
  sys.unlinkSync = wrapWrite(sys.unlinkSync);
  sys.writeFile = wrapWrite(sys.writeFile);
  sys.writeFileSync = wrapWrite(sys.writeFileSync);

  return Object.defineProperties(sys, {
    diskReads: {
      get() {
        return diskReads;
      },
      set(val: number) {
        diskReads = val;
      },
    },
    diskWrites: {
      get() {
        return diskWrites;
      },
      set(val: number) {
        diskWrites = val;
      },
    },
  });
};
