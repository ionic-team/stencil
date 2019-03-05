import * as d from '@declarations';

const cstrs = new Map<string, d.ComponentNativeConstructor>();

export const loadModule = (cmpMeta: d.ComponentLazyRuntimeMeta, _hostRef: d.HostRef): any => {
  return cstrs.get(cmpMeta.t);
};


export const getComponent = (tagName: string) => {
  return cstrs.get(tagName);
};


export const registerComponents = (Cstrs: d.ComponentNativeConstructor[]) => {
  Cstrs.forEach(Cstr => {
    cstrs.set(Cstr.cmpMeta.t, Cstr);
  });
};


export const getDoc = (elm?: Node) => {
  if (elm != null) {
    if (elm.nodeType === 9) {
      return elm as Document;
    }
    return elm.ownerDocument;
  }
  return null;
};

export const getWin = (elm?: Node) => {
  const doc = getDoc(elm);
  if (doc != null) {
    return doc.defaultView;
  }
  return null;
};

export const getHead = (elm?: Node) => {
  const doc = getDoc(elm);
  if (doc != null) {
    return doc.head;
  }
  return null;
};

export const readTask = (cb: Function) => cb();

export const writeTask = (cb: Function) => cb();

export const tick = {
  then(cb: Function) {
    cb();
  }
};

export const consoleError = (e: any) => console.error(e);

const Context = {
  isServer: true,
  enableListener: () => console.log('TODO'),
  queue: {
    write: writeTask,
    read: readTask,
    tick
  }
};

export const getContext = (ref: d.RuntimeRef, context: string) => {
  if (context === 'window') {
    return getWin(getHostRef(ref).$hostElement$);
  }
  if (context === 'document') {
    return getDoc(getHostRef(ref).$hostElement$);
  }
  if (context === 'isServer') {
    return true;
  }
  return (Context as any)[context];
};

export const plt: d.PlatformRuntime = {};

export const supportsShadowDom = false;

export const supportsListenerOptions = false;

const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) => {
  const hostRef: d.HostRef = {
    $stateFlags$: 0,
    $hostElement$: elm,
    $instanceValues$: new Map(),
  };
  hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
  return hostRefs.set(elm, hostRef);
};


export const styles: d.StyleMap = new Map();

export const rootAppliedStyles: d.RootAppliedStyleMap = new WeakMap();


export {
  connectedCallback,
  createEvent,
  getConnect,
  getElement,
  setMode,
  getMode,
  getWindow,
  getDocument,
  getAssetPath,
  Build,
  Host,
  h
} from '@runtime';
