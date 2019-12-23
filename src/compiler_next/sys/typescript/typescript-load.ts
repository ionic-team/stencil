import * as d from '../../../declarations';
import { CACHES } from '../fetch/fetch-cache';
import { catchError } from '@utils';
import { getRemoteTypeScriptUrl } from '../dependencies';
import { HAS_FETCH_CACHE, IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc } from '../environment';
import { patchTsSystemUtils } from './typescript-sys';


export const loadTypescript = async (diagnostics: d.Diagnostic[]) => {
  try {
    if (IS_NODE_ENV) {
      // NodeJS
      return requireFunc('typescript');
    }

    if (IS_WEB_WORKER_ENV) {
      // browser web worker
      const tsExternalUrl = getRemoteTypeScriptUrl();
      const tsExternal = await importTypescriptScript(tsExternalUrl);
      if (tsExternal) {
        return tsExternal;
      }

      // const tsDep = dependencies.find(dep => dep.name === 'typescript');
      // const tsLocalUrl = new URL(`../typescript/${tsDep.main}`, location.href).href;
      // const tsLocal = await importTypescriptScript(tsLocalUrl);
      // if (tsLocal) {
      //   return tsLocal;
      // }

      throw new Error(`unable to load typescript from url "${tsExternalUrl}"`);
    }

    throw new Error(`typescript: compiler can only run from within a web worker or nodejs`);

  } catch (e) {
    catchError(diagnostics, e);
  }
};

const importTypescriptScript = async (tsUrl: string) => {
  let ts: any = null;
  try {

    // if (compilerBuild.stencilVersion.includes('-dev.')) {
    //   // be able to easily step through and debug typescript.js
    //   (self as any).importScripts(tsUrl);
    //   if ((self as any).ts) {
    //     ts = (self as any).ts;
    //   }
    // }

    if (!ts) {
      const content = await cachedTypescriptFetch(tsUrl);
      if (content) {
        const getTs = new Function(content + ';return ts;');
        ts = getTs();
      }
    }

    if (ts) {
      ts.sys = ts.sys || {};
      ts.sys.getExecutingFilePath = () => tsUrl;
      patchTsSystemUtils(ts.sys);
    }

  } catch (e) {}
  return ts;
};

const cachedTypescriptFetch = async (tsUrl: string) => {
  try {
    const cache = HAS_FETCH_CACHE ? await caches.open(CACHES.core) : null;
    if (cache) {
      const cache = await caches.open(CACHES.core);
      const cachedRsp = await cache.match(tsUrl);
      if (cachedRsp) {
        return cachedRsp.text();
      }
    }

    const rsp = await fetch(tsUrl);
    if (rsp && rsp.ok) {
      if (cache) {
        cache.put(tsUrl, rsp.clone());
      }
      return rsp.text();
    }

  } catch (e) {
    console.error(e);
  }

  return null;
};
