import * as d from '@declarations';
export { Host, bootstrapLazy, createEvent, getElement, getConnect, h } from '@runtime';
import { resetTaskQueue } from './task-queue';
import { resetWindow, setupGlobal } from '@mock-doc';

export * from './task-queue';

export const win = setupGlobal(global) as Window;

export const getWindow = (_?: any) => win;

export const getDocument = (_?: any) => getWindow().document;

export const getHead = (_?: any) => getDocument().head;

const hostRefs = new Map<d.RuntimeRef, d.HostRef>();

export const rootAppliedStyles: d.RootAppliedStyleMap = new WeakMap();

export const styles: d.StyleMap = new Map();

export const plt: d.PlatformRuntime = {
  $isTmpDisconnected$: false,
  $queueCongestion$: 0,
  $queuePending$: false,
};

export const supportsShadowDom = true;

export const supportsListenerOptions = true;

export function resetPlatform() {
  resetWindow(win);
  hostRefs.clear();
  styles.clear();
  plt.$isTmpDisconnected$ = false;

  resetTaskQueue();
}


export const getHostRef = (elm: d.RuntimeRef) =>
  hostRefs.get(elm);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) =>
  hostRefs.set(elm, {
    $stateFlags$: 0,
    $hostElement$: elm,
    $instanceValues$: new Map(),
  });

const Context = {
  isServer: false,
  enableListener: () => console.log('TODO'),
  queue: {}
};

export const getContext = (elm: Node, context: string) => {
  if (context === 'window') {
    return getWindow(elm);
  }
  if (context === 'document') {
    return getDocument(elm);
  }
  if (context === 'isServer') {
    return true;
  }
  return (Context as any)[context];
};

