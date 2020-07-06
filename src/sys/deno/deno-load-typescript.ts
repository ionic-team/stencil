import type * as d from '../../declarations';
import { noop } from '@utils';
import type { System } from 'typescript';

export const denoLoadTypeScript = (sys: d.CompilerSystem, typescriptPath: string): any =>
  new Promise(async (promiseResolve, promiseReject) => {
    try {
      // ensure typescript compiler doesn't think it's nodejs
      (globalThis as any).process.browser = true;

      // fake cjs module.exports so typescript import gets added to it
      const orgModule = (globalThis as any).module;
      (globalThis as any).module = { exports: {} };

      // use actual dynamic import(), and typescript will be added to the fake module.exports
      await sys.dynamicImport(typescriptPath);

      // get the typescript export from the fake cjs module.exports
      const importedTs = (globalThis as any).module.exports;

      if (orgModule) {
        (globalThis as any).module = orgModule;
      } else {
        delete (globalThis as any).module;
      }

      // add our half-baked ts.sys (that'll get replaced later)// create a half-baked sys just to get us going
      // later on we'll wire up ts.sys w/ the actual stencil sys
      const tsSys: System = {
        args: [],
        createDirectory: noop,
        directoryExists: p => {
          const s = sys.statSync(p);
          return !!s && s.isDirectory();
        },
        exit: sys.exit,
        fileExists: p => {
          const s = sys.statSync(p);
          return !!s && s.isFile();
        },
        getCurrentDirectory: sys.getCurrentDirectory,
        getDirectories: () => [],
        getExecutingFilePath: () => typescriptPath,
        newLine: '\n',
        readDirectory: () => [],
        readFile: sys.readFileSync,
        resolvePath: sys.platformPath.resolve,
        useCaseSensitiveFileNames: false,
        write: noop,
        writeFile: noop,
      };
      importedTs.sys = tsSys;

      promiseResolve(importedTs);
    } catch (e) {
      promiseReject(e);
    }
  });
