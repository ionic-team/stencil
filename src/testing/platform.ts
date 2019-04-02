import * as d from '../declarations';
import { resetTaskQueue } from './task-queue';
import { resetWindow, setupGlobal } from '@mock-doc';

export * from './task-queue';

export const win = setupGlobal(global) as Window;

export const getWin = (_?: any) => win;

export const getDoc = (_?: any) => getWin().document;

export const getHead = (_?: any) => getDoc().head;

const hostRefs = new Map<d.RuntimeRef, d.HostRef>();

export const styles: d.StyleMap = new Map();

export const plt: d.PlatformRuntime = {
  $isTmpDisconnected$: false,
  $queueCongestion$: 0,
  $queuePending$: false,
};

export const supportsShadowDom = true;

export const supportsListenerOptions = true;

export const supportsConstructibleStylesheets = false;

export function resetPlatform() {
  resetWindow(win);

  hostRefs.clear();
  styles.clear();
  plt.$isTmpDisconnected$ = false;

  if (plt.$orgLocNodes$ != null) {
    plt.$orgLocNodes$.clear();
    plt.$orgLocNodes$ = undefined;
  }

  resetTaskQueue();
}


export const getHostRef = (elm: d.RuntimeRef) =>
  hostRefs.get(elm);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) => {
  const hostRef: d.HostRef = {
    $stateFlags$: 0,
    $hostElement$: elm,
    $instanceValues$: new Map(),
  };
  hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
  hostRefs.set(elm, hostRef);
};

const Context = {
  isServer: false,
  enableListener: () => console.log('TODO'),
  queue: {}
};

export const getContext = (elm: Node, context: string) => {
  if (context === 'window') {
    return getWin(elm);
  }
  if (context === 'document') {
    return getDoc(elm);
  }
  if (context === 'isServer') {
    return true;
  }
  return (Context as any)[context];
};

export {
  Host,
  bootstrapLazy,
  patchDynamicImport,
  createEvent,
  getElement,
  getConnect,
  getValue,
  insertVdomAnnotations,
  h,
  parsePropertyValue,
  setValue
} from '@runtime';
