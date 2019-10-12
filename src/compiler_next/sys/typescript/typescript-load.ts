import * as d from '../../../declarations';
import { catchError } from '@utils';
import { dependencies, getRemoteDependencyUrl } from '../dependencies';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc } from '../environment';


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
      const tsUrl = getRemoteDependencyUrl(tsDep);
      try {
        (self as any).importScripts(tsUrl);
        return globalThis.ts;
      } catch (e) {
        throw new Error(`unable to load typescript from url: ${tsUrl}`);
      }
    }

    throw new Error(`typescript: missing global "ts" variable`);

  } catch (e) {
    catchError(diagnostics, e);
  }
};

declare var globalThis: any;
