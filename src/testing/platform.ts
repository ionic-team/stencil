import * as d from '@declarations';
export { bootstrapLazy, createEvent, getElement } from '@runtime';
import { resetTaskQueue } from './task-queue';
import { setupGlobal } from '@mock-doc';

export * from './task-queue';

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

export function resetPlatform() {
  win.$reset();
  hostRefs.clear();
  styles.clear();
  plt.appMode = null;
  plt.isTmpDisconnected = false;
  plt.supportsShadowDom = true;

  resetTaskQueue();
}


export const getHostRef = (elm: d.RuntimeRef) =>
  hostRefs.get(elm);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.lazyInstance = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) =>
  hostRefs.set(elm, {
    hostElement: elm,
    instanceValues: new Map(),
  });

const Context = {
  window: win,
  document: doc,
  isServer: false,
  enableListener: () => console.log('TODO'),
  queue: {}
};

export function getContext(context: string): any {
  return (Context as any)[context];
}
