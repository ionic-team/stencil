import * as d from '../../../declarations';
import { cachedFetch } from '../fetch/fetch-cache';
import { catchError, IS_GLOBAL_THIS_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV, isFunction, requireFunc, IS_FETCH_ENV } from '@utils';
import { getRemoteTypeScriptUrl } from '../dependencies';
import { patchTsSystemUtils } from './typescript-sys';
import ts from 'typescript';


export const loadTypescript = async (diagnostics: d.Diagnostic[], typescriptPath: string) => {
  const tsSync = loadTypescriptSync(diagnostics, typescriptPath);
  if (tsSync != null) {
    return tsSync;
  }

  if (IS_FETCH_ENV) {
    try {
      const tsUrl = typescriptPath || getRemoteTypeScriptUrl();
      const rsp = await cachedFetch(tsUrl);
      const content = await rsp.text();
      const getTsFunction = new Function(content + ';return ts;');
      const fetchTs = getLoadedTs(getTsFunction(), 'fetch', tsUrl);
      if (fetchTs) {
        patchImportedTs(fetchTs, tsUrl);
        return fetchTs;
      }

    } catch (e) {
      catchError(diagnostics, e);
    }
  }

  return null;
};

export const loadTypescriptSync = (diagnostics: d.Diagnostic[], typescriptPath: string): TypeScriptModule => {
  try {
    if ((ts as TypeScriptModule).__loaded) {
      // already loaded
      return ts as TypeScriptModule;
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
      // web worker
      // doing this before the globalThis check cuz we'd
      // rather ensure we're using a valid typescript version
      const tsUrl = typescriptPath || getRemoteTypeScriptUrl();
      // importScripts() will be synchronous within a web worker
      (self as any).importScripts(tsUrl);
      const webWorkerTs = getLoadedTs((self as any).ts, 'importScripts', tsUrl);
      if (webWorkerTs) {
        patchImportedTs(webWorkerTs, tsUrl);
        return webWorkerTs;
      }
    }

    if (IS_GLOBAL_THIS_ENV) {
      // check if the global object has "ts" on it
      // could be main browser thread, browser web worker, or nodejs global
      const globalThisTs = getLoadedTs((globalThis as any).ts, 'globalThis', typescriptPath);
      if (globalThisTs) {
        return globalThisTs
      }
    }

  } catch (e) {
    catchError(diagnostics, e);
  }
  return null;
};

const patchImportedTs = (importedTs: TypeScriptModule, tsUrl: string) => {
  importedTs.sys = importedTs.sys || ({} as any);
  importedTs.sys.getExecutingFilePath = () => tsUrl;
  patchTsSystemUtils(importedTs.sys);
};

const getLoadedTs = (loadedTs: TypeScriptModule, source: string, typescriptPath: string)  => {
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