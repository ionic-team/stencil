import type * as d from '../../../declarations';
import { isFunction, IS_NODE_ENV, IS_BROWSER_ENV, IS_WEB_WORKER_ENV, IS_DENO_ENV } from '@utils';
import { createSystem } from '../stencil-sys';
import { dependencies } from '../dependencies';
import { denoLoadTypeScript } from '../../../sys/deno/deno-load-typescript';
import { nodeLoadTypeScript } from '../../../sys/node/node-load-typescript';
import { patchImportedTsSys as patchRemoteTsSys } from './typescript-patch';
import ts from 'typescript';

export const loadTypescript = (sys: d.CompilerSystem, rootDir: string, typeScriptPath: string, sync: boolean): TypeScriptModule | Promise<TypeScriptModule> => {
  // try sync load typescript methods first

  if ((ts as TypeScriptModule).__loaded) {
    // already loaded
    return ts as TypeScriptModule;
  }

  // check if the global object has "ts" on it
  // could be browser main thread, browser web worker, or nodejs global
  const globalThisTs = getLoadedTs((globalThis as any).ts);
  if (globalThisTs) {
    return globalThisTs;
  }

  if (IS_NODE_ENV) {
    const nodeTs = getLoadedTs(nodeLoadTypeScript(typeScriptPath));
    if (nodeTs) {
      return nodeTs;
    }
  }

  const tsUrl = getTsUrl(sys, typeScriptPath);

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
  if (!(ts as TypeScriptModule).__promise) {
    if (IS_DENO_ENV) {
      (ts as TypeScriptModule).__promise = denoLoadTypeScript(sys, rootDir, typeScriptPath);
    }

    if (IS_BROWSER_ENV) {
      (ts as TypeScriptModule).__promise = browserMainLoadTypeScript(tsUrl);
    }

    throw new Error(`Unable to load TypeScript`);
  }

  return (ts as TypeScriptModule).__promise;
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
        resolve(patchRemoteTsSys(browserTs, tsUrl));
      } else {
        reject(`Unable to load TypeScript via browser script`);
      }
    };
    scriptElm.onerror = ev => reject(ev);
    scriptElm.src = tsUrl;
  });

const getTsUrl = (sys: d.CompilerSystem, typeScriptPath: string) => {
  if (typeScriptPath) {
    return typeScriptPath;
  }
  sys = sys || createSystem();
  const tsDep = dependencies.find(dep => dep.name === 'typescript');
  return sys.getRemoteModuleUrl({ moduleId: tsDep.name, version: tsDep.version, path: tsDep.main });
};

const getLoadedTs = (loadedTs: TypeScriptModule) => {
  if (loadedTs != null && isFunction(loadedTs.transpileModule)) {
    loadedTs.__loaded = true;
    Object.assign(ts, loadedTs);
    return loadedTs;
  }
  return null;
};

type TypeScript = typeof ts;

export interface TypeScriptModule extends TypeScript {
  __loaded: boolean;
  __promise?: Promise<TypeScriptModule>;
}
