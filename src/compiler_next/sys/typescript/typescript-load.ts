import * as d from '../../../declarations';
import { CACHES } from '../fetch/fetch-cache';
import { catchError } from '@utils';
import { getRemoteTypeScriptUrl } from '../dependencies';
import { HAS_FETCH_CACHE, IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc } from '../environment';
import { patchTsSystemUtils } from './typescript-sys';
import { version } from '../../../version';
import ts from 'typescript';


export const loadTypescript = async (diagnostics: d.Diagnostic[]): Promise<typeof ts> => {
  try {
    if ((ts as any).__loaded) {
      // already loaded
      return ts;
    }

    if (IS_NODE_ENV) {
      // NodeJS
      const nodeTs = requireFunc('typescript');
      nodeTs.__loaded = true;
      return nodeTs;
    }

    // browser
    const tsExternalUrl = getRemoteTypeScriptUrl();
    const tsExternal = await importTypescriptScript(tsExternalUrl);
    if (tsExternal) {
      tsExternal.__loaded = true;
      return tsExternal;
    }

    throw new Error(`unable to load typescript from url "${tsExternalUrl}"`);

  } catch (e) {
    catchError(diagnostics, e);
  }
  return null;
};

const importTypescriptScript = async (tsUrl: string) => {
  let importedTs: any = null;
  try {

    if (IS_WEB_WORKER_ENV && version.includes('-dev.')) {
      // be able to easily step through and debug typescript.js
      // but a prod build of stencil.js should use the fetch()
      // way so we can cache it better
      (self as any).importScripts(tsUrl);
      if ((self as any).ts) {
        importedTs = (self as any).ts;
      }
    }

    if (!importedTs) {
      const content = await cachedTypescriptFetch(tsUrl);
      if (content) {
        const getTs = new Function(content + ';return ts;');
        importedTs = getTs();
      }
    }

    if (importedTs) {
      importedTs.sys = importedTs.sys || {};
      importedTs.sys.getExecutingFilePath = () => tsUrl;
      patchTsSystemUtils(importedTs.sys);
    }

  } catch (e) {}
  return importedTs;
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
