import * as d from '../declarations';
import { resetTaskQueue } from './task-queue';
import { flushAll } from './task-queue';
import { setupGlobal } from '@mock-doc';

export * from './task-queue';

export const win = setupGlobal(global) as Window;

export const doc = win.document;

const hostRefs = new Map<d.RuntimeRef, d.HostRef>();

export const styles: d.StyleMap = new Map();
export const cssVarShim: d.CssVarSim = false as any;

export const Build: d.UserBuildConditionals = {
  isDev: true,
  isBrowser: false
};

export const plt: d.PlatformRuntime = {
  $flags$: 0,
  $resourcesUrl$: '',
  jmp: (h) => h(),
  raf: (h) => requestAnimationFrame(h),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};

export const supportsShadowDom = true;

export const supportsListenerOptions = true;

export const supportsConstructibleStylesheets = false;

let isAutoApplyingChanges = false;
let autoApplyTimer: any = undefined;

export function resetPlatform() {
  if (win && typeof win.close === 'function') {
    win.close();
  }

  hostRefs.clear();
  styles.clear();
  plt.$flags$ = 0;
  Object.keys(Context).forEach(key => delete Context[key]);

  if (plt.$orgLocNodes$ != null) {
    plt.$orgLocNodes$.clear();
    plt.$orgLocNodes$ = undefined;
  }

  win.location.href = plt.$resourcesUrl$ = `http://testing.stenciljs.com/`;

  resetTaskQueue();
  stopAutoApplyChanges();

  cstrs.clear();
}


export function stopAutoApplyChanges() {
  isAutoApplyingChanges = false;
  if (autoApplyTimer) {
    clearTimeout(autoApplyTimer);
    autoApplyTimer = undefined;
  }
}

export async function startAutoApplyChanges() {
  isAutoApplyingChanges = true;
  flushAll().then(() => {
    if (isAutoApplyingChanges) {
      autoApplyTimer = setTimeout(() => {
        startAutoApplyChanges();
      }, 100);
    }
  });
}


export function registerContext(context: any) {
  if (context) {
    Object.assign(Context, context);
  }
}

export const getHostRef = (elm: d.RuntimeRef) => {
  return hostRefs.get(elm);
};

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) => {
  if (lazyInstance == null || lazyInstance.constructor == null) {
    throw new Error(`Invalid component constructor`);
  }

  if (hostRef == null) {
    const Cstr = lazyInstance.constructor as d.ComponentTestingConstructor;
    const tagName = (Cstr.COMPILER_META && Cstr.COMPILER_META.tagName) ? Cstr.COMPILER_META.tagName : 'div';
    const elm = document.createElement(tagName);
    registerHost(elm);
    hostRef = getHostRef(elm);
  }

  hostRef.$lazyInstance$ = lazyInstance;
  return hostRefs.set(lazyInstance, hostRef);
};


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
  hostRefs.set(elm, hostRef);
};

export const Context: any = {};

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
    const nodeName = elm.nodeName;
    if (nodeName) {
      const cstr = cstrs.get(nodeName.toLowerCase());
      if (cstr != null && cstr.COMPILER_META != null && cstr.COMPILER_META.properties != null) {
        return cstr.COMPILER_META.properties.some(p => p.name === memberName);
      }
    }
  }
  return false;
};

export const patchDynamicImport = (_: string) => { return; };

export * from '@runtime';
