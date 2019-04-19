import * as d from '../declarations';
import { resetTaskQueue } from './task-queue';
import { resetWindow, setupGlobal } from '@mock-doc';

export * from './task-queue';

export const win = setupGlobal(global) as Window;

export const doc = win.document;

const hostRefs = new Map<d.RuntimeRef, d.HostRef>();

export const styles: d.StyleMap = new Map();

export const Build: d.UserBuildConditionals = {
  isDev: true,
  isServer: false
};

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

  cstrs.clear();
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

export const getContext = (_elm: Node, context: string) => {
  if (context === 'window') {
    return win;
  }
  if (context === 'document') {
    return doc;
  }
  if (context === 'isServer') {
    return true;
  }
  return (Context as any)[context];
};

const cstrs = new Map<string, d.ComponentTestingConstructor>();

export const registerComponents = (Cstrs: d.ComponentTestingConstructor[]) => {
  Cstrs.forEach(Cstr => {
    cstrs.set(Cstr.COMPILER_META.tagName, Cstr);
  });
};

export const isMemberInElement = (elm: any, memberName: string) => {
  if (elm != null) {
    if (memberName in elm) {
      return true;
    }
    const cstr = cstrs.get(elm.nodeName.toLowerCase());
    if (cstr != null && cstr.COMPILER_META != null && cstr.COMPILER_META.properties != null) {
      return cstr.COMPILER_META.properties.some(p => p.name === memberName);
    }
  }
  return false;
};

export const patchDynamicImport = (_: string) => { return; };

export {
  Host,
  bootstrapLazy,
  createEvent,
  getElement,
  getConnect,
  getValue,
  insertVdomAnnotations,
  h,
  parsePropertyValue,
  postUpdateComponent,
  setValue
} from '@runtime';
