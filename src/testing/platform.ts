import * as d from '@declarations';
import { resetTaskQueue } from './task-queue';
import { setupGlobal } from '@mock-doc';

export * from './task-queue';


export const consoleError = (e: any) => {
  throw e;
};

export const win = setupGlobal(global);

export const doc = win.document;

export const hostRefs = new Map();

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

export function resetPlatform() {
  win.$reset();
  hostRefs.clear();
  styles.clear();
  plt.appMode = null;
  plt.isTmpDisconnected = false;
  plt.supportsShadowDom = true;

  onAppReadyCallbacks.length = 0;
  activelyProcessingCmps.clear();

  resetTaskQueue();
}

export const getElement = (ref: any) => hostRefs.get(ref).elm;

export const getHostRef = (elm: d.HostElement, hostRef?: d.HostRef) => {
  hostRef = hostRefs.get(elm);

  if (!hostRef) {
    hostRefs.set(elm, hostRef = {
      instanceValues: new Map(),
      lazyInstance: elm
    });
  }

  return hostRef;
};

export const registerLazyInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.lazyInstance = lazyInstance, hostRef);


export const registerStyle = (styleId: string, styleText: string) => styles.set(styleId, styleText);
