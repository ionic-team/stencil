import * as d from '../declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { setupGlobal } from '@stencil/core/mock-doc';


export const resolved = Promise.resolve();

export const consoleError = (e: any) => console.error(e);

export const win = setupGlobal(global);

export const doc = win.document;

export const refs = new Map();

export const rootAppliedStyles: d.RootAppliedStyleMap = new WeakMap();

export const styles: d.StyleMap = new Map();

export const plt: d.PlatformRuntime = {
  appMode: null,
  isTmpDisconnected: false,
  queueCongestion: 0,
  queuePending: false,
  supportsShadowDom: true
};

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = new Set();


export const raf = (cb: any) => {
  queuedRafs.push(cb);
};

const queuedRafs: Function[] = [];

export function flushQueue() {
  return new Promise((resolve, reject) => {
    try {
      process.nextTick(() => {
        let cb: Function;
        while ((cb = queuedRafs.shift())) {
          cb(Date.now());
        }
      });

      resolve();

    } catch (e) {
      reject(`flushQueue: ${e}`);
    }
  });
}

export const queueDomReads: d.RafCallback[] = [];
export const queueDomWrites: d.RafCallback[] = [];
export const queueDomWritesLow: d.RafCallback[] = [];


const moduleLoaded = new Map();

export function resetPlatform() {
  win.$reset();
  refs.clear();
  styles.clear();
  plt.appMode = null;
  plt.isTmpDisconnected = false;
  plt.supportsShadowDom = true;
  plt.queueCongestion = 0;
  plt.queuePending = false;
  onAppReadyCallbacks.length = 0;
  activelyProcessingCmps.clear();
  queueDomReads.length = 0;
  queueDomWrites.length = 0;
  queueDomWritesLow.length = 0;
  queuedRafs.length = 0;
  moduleLoaded.clear();
}

interface QueuedLoadModule {
  bundleId: any;
  resolve: Function;
}
const queuedLoadModules: QueuedLoadModule[] = [];

export async function loadModule(_elm: d.HostElement, bundleId: d.ModeBundleId) {
  return new Promise<any>(resolve => {
    queuedLoadModules.push({
      bundleId,
      resolve: () => resolve(moduleLoaded.get(bundleId))
    });
  });
}

export function flushLoadModule(bundleId?: string) {
  return new Promise((resolve, reject) => {
    try {
      process.nextTick(() => {
        if (bundleId != null) {
          for (let i = 0; i < queuedLoadModules.length; i++) {
            if (queuedLoadModules[i].bundleId === bundleId) {
              queuedLoadModules[i].resolve();
              queuedLoadModules.splice(i, 1);
              i--;
            }
          }

        } else {
          let queuedLoadModule: QueuedLoadModule;
          while ((queuedLoadModule = queuedLoadModules.shift())) {
            queuedLoadModule.resolve();
          }
        }

        resolve();
      });

    } catch (e) {
      reject(`flushLoadModule: ${e}`);
    }
  });
}

export function registerModule(bundleId: string, Cstr: any) {
  moduleLoaded.set(bundleId, Cstr);
}


export async function flushAll() {
  while (queueDomReads.length > 0 || queueDomWrites.length > 0 || queueDomWritesLow.length > 0 || queuedRafs.length > 0 || queuedLoadModules.length > 0) {
    await flushLoadModule();
    await flushQueue();
  }
}

export const getElement = (ref: any) => refs.get(ref).elm;

export const getElmRef = (elm: d.HostElement, elmData?: d.ElementData) => {
  elmData = refs.get(elm);

  if (!elmData) {
    refs.set(elm, elmData = {
      elm: elm,
      instanceValues: new Map(),
      instance: BUILD.lazyLoad ? null : elm
    });
  }

  return elmData;
};

export const registerLazyInstance = (lazyInstance: any, elmData: d.ElementData) =>
  refs.set(elmData.instance = lazyInstance, elmData);
