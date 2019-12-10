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

    if (IS_WEB_WORKER_ENV) {
      // browser web worker
      const tsDep = dependencies.find(dep => dep.name === 'typescript');
      const tsExternalUrl = getRemoteDependencyUrl(tsDep);
      const tsExternal = importTypescriptScript(tsExternalUrl);
      if (tsExternal) {
        return tsExternal;
      }

      const tsLocalUrl = new URL(`../typescript/${tsDep.main}`, location.href).href;
      const tsLocal = importTypescriptScript(tsLocalUrl);
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

const importTypescriptScript = (tsUrl: string) => {
  let ts: any = null;

  try {
    (self as any).importScripts(tsUrl);
    if ((self as any).ts) {
      ts = (self as any).ts;
      ts.sys = ts.sys || {};
      ts.sys.getExecutingFilePath = () => tsUrl;
    }

  } catch (e) {}

  return ts;
};
