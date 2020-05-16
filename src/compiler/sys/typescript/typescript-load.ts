import * as d from '../../../declarations';
import { catchError, IS_GLOBAL_THIS_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV, isFunction, requireFunc, IS_FETCH_ENV } from '@utils';
import { httpFetch } from '../fetch/fetch-utils';
import { getRemoteTypeScriptUrl } from '../dependencies';
import { patchTsSystemUtils } from './typescript-sys';
import ts from 'typescript';

export const loadTypescript = async (sys: d.CompilerSystem, diagnostics: d.Diagnostic[], typescriptPath: string) => {
  const tsSync = loadTypescriptSync(sys, diagnostics, typescriptPath);
  if (tsSync != null) {
    return tsSync;
  }

  if (IS_FETCH_ENV) {
    try {
      // browser main thread
      const tsUrl = typescriptPath || getRemoteTypeScriptUrl(sys);
      const rsp = await httpFetch(sys, tsUrl);
      const content = await rsp.text();
      const getTsFunction = new Function(content + ';return ts;');
      const fetchTs = getLoadedTs(getTsFunction(), 'fetch', tsUrl);
      if (fetchTs) {
        patchImportedTsSys(fetchTs, tsUrl);
        return fetchTs;
      }
    } catch (e) {
      catchError(diagnostics, e);
    }
  }

  return null;
};

export const loadTypescriptSync = (sys: d.CompilerSystem, diagnostics: d.Diagnostic[], typescriptPath: string): TypeScriptModule => {
  try {
    if ((ts as TypeScriptModule).__loaded) {
      // already loaded
      return ts as TypeScriptModule;
    }

    if (IS_GLOBAL_THIS_ENV) {
      // check if the global object has "ts" on it
      // could be browser main thread, browser web worker, or nodejs global
      const globalThisTs = getLoadedTs((globalThis as any).ts, 'globalThis', typescriptPath);
      if (globalThisTs) {
        return globalThisTs;
      }
    }

    if (IS_NODE_ENV) {
      // NodeJS
      const nodeModuleId = typescriptPath || 'typescript';
      const nodeTs = getLoadedTs(requireFunc(nodeModuleId), 'nodejs', nodeModuleId);
      if (nodeTs) {
        return nodeTs;
      }
    }

    if (IS_WEB_WORKER_ENV) {
      // browser web worker
      // doing this before the globalThis check cuz we'd
      // rather ensure we're using a valid typescript version
      const tsUrl = typescriptPath || getRemoteTypeScriptUrl(sys);
      // importScripts() will be synchronous within a web worker
      (self as any).importScripts(tsUrl);
      const webWorkerTs = getLoadedTs((self as any).ts, 'importScripts', tsUrl);
      if (webWorkerTs) {
        patchImportedTsSys(webWorkerTs, tsUrl);
        return webWorkerTs;
      }
    }
  } catch (e) {
    catchError(diagnostics, e);
  }
  return null;
};

const patchImportedTsSys = (importedTs: TypeScriptModule, tsUrl: string) => {
  importedTs.sys = importedTs.sys || ({} as any);
  importedTs.sys.getExecutingFilePath = () => tsUrl;
  patchTsSystemUtils(importedTs.sys);
};

const getLoadedTs = (loadedTs: TypeScriptModule, source: string, typescriptPath: string) => {
  if (loadedTs != null && isFunction(loadedTs.transpileModule)) {
    loadedTs.__loaded = true;
    loadedTs.__source = source;
    loadedTs.__path = typescriptPath;
    return loadedTs;
  }
  return null;
};

type TS = typeof ts;

export interface TypeScriptModule extends TS {
  __loaded: boolean;
  __source: string;
  __path: string;
}
