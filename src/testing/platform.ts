import * as d from '@declarations';
import { resetTaskQueue } from './task-queue';
import { setupGlobal } from '@mock-doc';
export { createEvent, getElement } from '@runtime';

export * from './task-queue';


export const consoleError = (e: any) => {
  throw e;
};

export const win = setupGlobal(global);

export const doc = win.document;

export const hostRefs = new Map<d.RuntimeRef, d.HostRef>();

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


export const getHostRef = (elm: d.RuntimeRef) =>
  hostRefs.get(elm);

export const registerLazyInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.lazyInstance = lazyInstance, hostRef);

export const registerStyle = (styleId: string, styleText: string) => styles.set(styleId, styleText);
