import type * as d from '../../../declarations';
import { denoLoadTypeScript } from '../../../sys/deno/deno-load-typescript';
import { dependencies } from '../dependencies.json';
import { isFunction, IS_NODE_ENV, IS_BROWSER_ENV, IS_WEB_WORKER_ENV, IS_DENO_ENV } from '@utils';
import { nodeLoadTypeScript } from '../../../sys/node/node-load-typescript';
import { patchRemoteTsSys } from './typescript-patch';
import ts from 'typescript';

const importedTs: ImportTypeScriptModule = {
  p: null,
};

export const loadTypescript = (sys: d.CompilerSystem, typescriptPath: string, sync: boolean): typeof ts | Promise<typeof ts> => {
  // try sync load typescript methods first
  if (exports.ts) {
    // already loaded
    return exports.ts;
  }

  // check if the global object has "ts" on it
  // could be browser main thread, browser web worker, or nodejs global
  const globalThisTs = getLoadedTs((globalThis as any).ts);
  if (globalThisTs) {
    return globalThisTs;
  }

  if (IS_NODE_ENV) {
    const nodeTs = getLoadedTs(nodeLoadTypeScript(typescriptPath));
    if (nodeTs) {
      return nodeTs;
    }
  }

  const tsUrl = getTsUrl(sys, typescriptPath);

  if (IS_WEB_WORKER_ENV) {
    const webWorkerTs = getLoadedTs(webWorkerLoadTypeScript(tsUrl));
    if (webWorkerTs) {
      patchRemoteTsSys(webWorkerTs, tsUrl);
      return webWorkerTs;
    }
  }

  if (sync) {
    throw new Error(`TypeScript "ts" must already be available on the global scope`);
  }

  // async at this point
  if (!importedTs.p) {
    if (IS_DENO_ENV) {
      importedTs.p = denoLoadTypeScript(sys, typescriptPath);
    } else if (IS_BROWSER_ENV) {
      importedTs.p = browserMainLoadTypeScript(tsUrl);
    } else {
      throw new Error(`Unable to load TypeScript`);
    }
  }

  return importedTs.p;
};

const webWorkerLoadTypeScript = (tsUrl: string) => {
  // browser web worker
  // doing this before the globalThis check cuz we'd
  // rather ensure we're using a valid typescript version
  // importScripts() will be synchronous within a web worker
  (self as any).importScripts(tsUrl);
  return (self as any).ts;
};

const browserMainLoadTypeScript = (tsUrl: string): any =>
  // browser main thread
  new Promise((resolve, reject) => {
    const scriptElm = document.createElement('script');
    scriptElm.onload = () => {
      const browserTs = getLoadedTs((globalThis as any).ts);
      if (browserTs) {
        patchRemoteTsSys(browserTs, tsUrl);
        resolve(browserTs);
      } else {
        reject(`Unable to load TypeScript via browser script`);
      }
    };
    scriptElm.onerror = ev => reject(ev);
    scriptElm.src = tsUrl;
    document.head.appendChild(scriptElm);
  });

const getTsUrl = (sys: d.CompilerSystem, typeScriptPath: string) => {
  if (typeScriptPath) {
    return typeScriptPath;
  }
  const typecriptDep = dependencies.find(dep => dep.name === 'typescript');
  return sys.getRemoteModuleUrl({ moduleId: typecriptDep.name, version: typecriptDep.version, path: typecriptDep.main });
};

const getLoadedTs = (loadedTs: typeof ts) => {
  if (loadedTs != null && isFunction(loadedTs.transpileModule)) {
    Object.assign(ts, loadedTs);
    return (exports.ts = loadedTs);
  }
  return null;
};

interface ImportTypeScriptModule {
  p: Promise<typeof ts>;
}

declare const exports: any;
