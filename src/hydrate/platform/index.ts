import * as d from '../../declarations';

const cstrs = new Map<string, d.ComponentNativeConstructor>();

export const loadModule = (cmpMeta: d.ComponentRuntimeMeta, _hostRef: d.HostRef, _hmrVersionId?: string): any => {
  return cstrs.get(cmpMeta.$tagName$);
};

export const getComponent = (tagName: string) => {
  return cstrs.get(tagName);
};

export const isMemberInElement = (elm: any, memberName: string) => {
  if (elm != null) {
    if (memberName in elm) {
      return true;
    }
    const nodeName = elm.nodeName;
    if (nodeName) {
      const hostRef: d.ComponentNativeConstructor = getComponent(nodeName.toLowerCase());
      if (hostRef != null && hostRef.cmpMeta != null && hostRef.cmpMeta.$members$ != null) {
        return memberName in hostRef.cmpMeta.$members$;
      }
    }
  }
  return false;
};

export const registerComponents = (Cstrs: d.ComponentNativeConstructor[]) => {
  Cstrs.forEach(Cstr => {
    cstrs.set(Cstr.cmpMeta.$tagName$, Cstr);
  });
};

export const win = window;

export const doc = win.document;

export const readTask = (cb: Function) => {
  process.nextTick(() => {
    try {
      cb();
    } catch (e) {
      consoleError(e);
    }
  });
};

export const writeTask = (cb: Function) => {
  process.nextTick(() => {
    try {
      cb();
    } catch (e) {
      consoleError(e);
    }
  });
};

export const nextTick = /*@__PURE__*/(cb: () => void) => Promise.resolve().then(cb);

export const consoleError = (e: any) => {
  if (e != null) {
    console.error(e.stack || e.message || e);
  }
};

export const consoleDevError = (..._: any[]) => {/* noop for hydrate */};

export const consoleDevWarn = (..._: any[]) => {/* noop for hydrate */};

export const consoleDevInfo = (..._: any[]) => {/* noop for hydrate */};

export const Context: any = {};


export const plt: d.PlatformRuntime = {
  $flags$: 0,
  $resourcesUrl$: '',
  jmp: (h) => h(),
  raf: (h) => requestAnimationFrame(h),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};

export const supportsShadowDom = false;

export const supportsListenerOptions = false;

export const supportsConstructibleStylesheets = false;

const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) => {
  const hostRef: d.HostRef = {
    $flags$: 0,
    $hostElement$: elm,
    $instanceValues$: new Map(),
    $renderCount$: 0
  };
  hostRef.$onInstancePromise$ = new Promise(r => hostRef.$onInstanceResolve$ = r);
  hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
  elm['s-p'] = [];
  elm['s-rc'] = [];
  return hostRefs.set(elm, hostRef);
};

export const Build: d.UserBuildConditionals = {
  isDev: false,
  isBrowser: false
};

export const styles: d.StyleMap = new Map();

export { hydrateApp } from './hydrate-app';

export * from '@runtime';
