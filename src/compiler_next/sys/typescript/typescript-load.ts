import * as d from '../../../declarations';
import { catchError } from '@utils';
import { dependencies, getRemoteDependencyUrl } from '../dependencies';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV, requireFunc, IS_SERVICE_WORKER_ENV } from '../environment';
import tsTypes from 'typescript';


export const loadTypescript = (diagnostics: d.Diagnostic[]) => {
  try {
    if (IS_NODE_ENV) {
      // NodeJS
      return requireFunc('typescript');
    }

    if (IS_WEB_WORKER_ENV) {
      // browser web worker
      const tsDep = dependencies.find(dep => dep.name === 'typescript');
      const tsExternalUrl = getRemoteDependencyUrl(tsDep);
      const tsExternal = fetchTypescriptScript(tsExternalUrl);
      if (tsExternal) {
        return tsExternal;
      }

      const tsLocalUrl = new URL(`../typescript/${tsDep.main}`, location.href).href;
      const tsLocal = fetchTypescriptScript(tsLocalUrl);
      if (tsLocal) {
        return tsLocal;
      }

      throw new Error(`unable to load typescript from url "${tsExternalUrl}" or "${tsLocalUrl}"`);
    }

    throw new Error(`typescript: compiler can only run from within a web worker or nodejs`);

  } catch (e) {
    catchError(diagnostics, e);
  }
};

const fetchTypescriptScript = (tsUrl: string) => {
  let ts: any = null;

  if (IS_SERVICE_WORKER_ENV) {
    // NOTE! async importScripts() do not work in service workers!
    // https://developers.google.com/web/tools/workbox/modules/workbox-sw#avoid_async_imports
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', tsUrl, false);
      xhr.send(null);

      if (xhr.status >= 200 && xhr.status < 300) {
        const tsContent = xhr.responseText;

        const getTs = new Function(tsContent + ';return ts;');
        ts = getTs();

        ts.sys = ts.sys || {};
        (ts.sys as tsTypes.System).getExecutingFilePath = () => tsUrl;
      }

    } catch (e) {}

  } else if (IS_WEB_WORKER_ENV) {
    try {
      (self as any).importScripts(tsUrl);
      if ((self as any).ts) {
        ts = (self as any).ts;
        ts.sys = ts.sys || {};
        ts.sys.getExecutingFilePath = () => tsUrl;
      }

    } catch (e) {}
  }

  return ts;
};
