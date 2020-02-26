import * as d from '../../../declarations';
import { cachedFetch } from '../fetch/fetch-cache';
import { catchError, IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc } from '@utils';
import { getRemoteTypeScriptUrl } from '../dependencies';
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
      const rsp = await cachedFetch(tsUrl);
      if (rsp) {
        const content = await rsp.text();
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
