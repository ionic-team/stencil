import type * as d from '../../declarations';
import { dirname, join, resolve } from 'path';
import { isExternalUrl } from '../../compiler/sys/fetch/fetch-utils';
import { noop } from '@utils';
import { typecriptDep } from '../../compiler/sys/dependencies';
import type { System } from 'typescript';

export const denoLoadTypeScript = (sys: d.CompilerSystem, rootDir: string, typeScriptPath: string): any =>
  new Promise(async (promiseResolve, promiseReject) => {
    try {
      let tsFilePath: string;
      let localTsFilePath: string;
      let loadTmpTs = false;

      if (typeScriptPath && !isExternalUrl(typeScriptPath)) {
        // manually provided a ts file path
        tsFilePath = typeScriptPath;
      } else {
        if (rootDir) {
          // create the app's local ts path when rootDir was provided
          localTsFilePath = sys.getLocalModulePath({ rootDir: rootDir, moduleId: typecriptDep.name, path: typecriptDep.main });
          const hasLocalTs = await sys.access(localTsFilePath);
          if (hasLocalTs) {
            // found a local ts file, import ts from this file
            tsFilePath = localTsFilePath;
          } else {
            // do not have a local ts file
            loadTmpTs = true;
          }
        } else {
          // rootDir wasn't provided, use the tmpdir
          loadTmpTs = true;
        }
      }

      if (loadTmpTs) {
        const tmpTsFilePath = join(sys.tmpdir(), `${typecriptDep.name}_${typecriptDep.version.replace(/\./g, '_')}.js`);
        const hasTmpTs = await sys.access(tmpTsFilePath);
        if (!hasTmpTs) {
          // the tmp ts file doesn't exist, download one
          const tsUrl = sys.getRemoteModuleUrl({ moduleId: typecriptDep.name, version: typecriptDep.version, path: typecriptDep.main });
          const rsp = await fetch(tsUrl);
          if (rsp.ok) {
            const tsContent = await rsp.clone().text();
            // write the downloaded ts file to the tmp dir
            await sys.writeFile(tmpTsFilePath, tsContent);
          } else {
            promiseReject(`unable to fetch: ${tsUrl}`);
            return;
          }
        }

        if (localTsFilePath) {
          // if we should have a local ts file, then
          // copy the tmp ts file to the local ts file
          await sys.mkdir(dirname(localTsFilePath), { recursive: true });
          await sys.copyFile(tmpTsFilePath, localTsFilePath);
          // import ts from the local ts file
          tsFilePath = localTsFilePath;
        } else {
          // import ts from the tmp ts file
          tsFilePath = tmpTsFilePath;
        }
      }

      // ensure typescript compiler doesn't think it's nodejs
      (globalThis as any).process.browser = true;

      // fake cjs module.exports so typescript import gets added to it
      const orgModule = (globalThis as any).module;
      (globalThis as any).module = { exports: {} };

      // use actual dynamic import(), and typescript will be added to the fake module.exports
      await sys.dynamicImport(tsFilePath);

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
        getExecutingFilePath: () => tsFilePath,
        newLine: '\n',
        readDirectory: () => [],
        readFile: sys.readFileSync,
        resolvePath: resolve,
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
