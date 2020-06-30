import { createRequire } from 'https://deno.land/std/node/module.ts';
import { join } from 'https://deno.land/std/path/mod.ts';
import * as nodeFs from 'https://deno.land/std/node/fs.ts';
import process from './deno-node-process';
import type { Deno as DenoTypes } from '../../../types/lib.deno';


// idk why the node compat doesn't come with stat and statSync on it??
// https://deno.land/std/node/fs.ts

Object.assign(nodeFs, {
  stat: (...args: any[]) => {
    const path: string = args[0];
    const cb = args.length > 2 ? args[2] : args[1]
    try {
      const s = Deno.statSync(path);
      cb && cb(null, {
        isFile: () => s.isFile,
        isDirectory: () => s.isDirectory,
        isSymbolicLink: () => s.isSymlink,
        size: s.size,
      });
    } catch (e) {
      cb && cb(e);
    }
  },
  statSync: (path: string) => {
    const s = Deno.statSync(path);
    return {
      isFile: () => s.isFile,
      isDirectory: () => s.isDirectory,
      isSymbolicLink: () => s.isSymlink,
      size: s.size,
    };
  }
});

export const applyNodeCompat = (opts: { fromDir: string }) => {
  (globalThis as any).process = process;

  const nodeRequire = createRequire(join(opts.fromDir, 'noop.js'));
  (globalThis as any).require = nodeRequire;
};

declare const Deno: typeof DenoTypes;