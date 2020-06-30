import type * as d from '../../declarations';
import type TypeScript from 'typescript';
import { dependencies } from '../../compiler/sys/dependencies';
import { dirname, resolve } from 'path';
import { noop } from '@utils';
import type { Deno as DenoTypes } from '../../../types/lib.deno';

export const denoLoadTypeScript = (sys: d.CompilerSystem, rootDir: string, typeScriptPath: string): any =>
  new Promise(async (promiseResolve, promiseReject) => {
    if (!sys) {
      promiseReject(`Unable to load TypeScript without Deno sys`);
    } else {
      try {
        const tsDep = dependencies.find(dep => dep.name === 'typescript');

        const tsFilePath = typeScriptPath || sys.getLocalModulePath({ rootDir: rootDir, moduleId: tsDep.name, path: tsDep.main });

        try {
          Deno.statSync(tsFilePath);
        } catch (e) {
          const tsUrl = sys.getRemoteModuleUrl({ moduleId: tsDep.name, version: tsDep.version, path: tsDep.main });
          const rsp = await fetch(tsUrl);
          if (rsp.ok) {
            try {
              Deno.mkdirSync(dirname(tsFilePath), { recursive: true });
            } catch (e) {}

            const content = await rsp.clone().text();
            const encoder = new TextEncoder();
            await Deno.writeFile(tsFilePath, encoder.encode(content));
          } else {
            promiseReject(`unable to fetch: ${tsUrl}`);
            return;
          }
        }

        // ensure typescript compiler doesn't think it's nodejs
        (globalThis as any).process.browser = true;

        // fake cjs module.exports so typescript import gets added to it
        const orgModule = (globalThis as any).module;
        (globalThis as any).module = { exports: {} };
        await import(tsFilePath);

        // get the typescript export from the fake cjs module.exports
        const importedTs = (globalThis as any).module.exports;

        if (orgModule) {
          (globalThis as any).module = orgModule;
        } else {
          delete (globalThis as any).module;
        }

        // create half-baked sys just to get us going
        // later on we'll wire up ts sys w/ the actual stencil sys
        const tsSys: TypeScript.System = {
          args: [],
          createDirectory: noop,
          directoryExists: p => {
            try {
              const s = Deno.statSync(p);
              return s.isDirectory;
            } catch (e) {}
            return false;
          },
          exit: Deno.exit,
          fileExists: p => {
            try {
              const s = Deno.statSync(p);
              return s.isFile;
            } catch (e) {}
            return false;
          },
          getCurrentDirectory: Deno.cwd,
          getDirectories: () => [],
          getExecutingFilePath: () => tsFilePath,
          newLine: '\n',
          readDirectory: () => [],
          readFile: (p, encoding) => {
            try {
              const decoder = new TextDecoder(encoding);
              const data = Deno.readFileSync(p);
              return decoder.decode(data);
            } catch (e) {}
            return undefined;
          },
          resolvePath: p => resolve(p),
          useCaseSensitiveFileNames: Deno.build.os !== 'windows',
          write: noop,
          writeFile: noop,
        };
        importedTs.sys = tsSys;

        promiseResolve(importedTs);
      } catch (e) {
        promiseReject(e);
      }
    }
  });

declare const Deno: typeof DenoTypes;
