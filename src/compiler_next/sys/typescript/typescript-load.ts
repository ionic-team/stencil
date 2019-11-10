import * as d from '../../../declarations';
import { catchError } from '@utils';
import { dependencies, getRemoteDependencyUrl } from '../dependencies';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc } from '../environment';
import tsTypes from 'typescript';


export const loadTypescript = (diagnostics: d.Diagnostic[]) => {
  try {
    if (IS_NODE_ENV) {
      // NodeJS
      return requireFunc('typescript');
    }

    if (globalThis.ts) {
      // "ts" already on global scope
      return globalThis.ts;
    }

    if (IS_WEB_WORKER_ENV) {
      // browser web worker
      const tsDep = dependencies.find(dep => dep.name === 'typescript');
      const tsExternalUrl = getRemoteDependencyUrl(tsDep);
      try {
        (self as any).importScripts(tsExternalUrl);
        globalThis.ts.sys = globalThis.ts.sys || {};
        (globalThis.ts.sys as tsTypes.System).getExecutingFilePath = () => tsExternalUrl;
        return globalThis.ts;

      } catch (e) {
        // make a huge assumption and check for typescript dir as a sibling to this file
        // /lib/typescript.js
        const tsLocalUrl = new URL(`../typescript/${tsDep.main}`, location.href).href;
        try {
          (self as any).importScripts(tsLocalUrl);
          globalThis.ts.sys = globalThis.ts.sys || {};
          (globalThis.ts.sys as tsTypes.System).getExecutingFilePath = () => tsLocalUrl;
          return globalThis.ts;

        } catch (e) {
          throw new Error(`unable to load typescript from url "${tsExternalUrl}" or "${tsLocalUrl}"`);
        }
      }
    }

    throw new Error(`typescript: missing global "ts" variable`);

  } catch (e) {
    catchError(diagnostics, e);
  }
};

declare var globalThis: any;
