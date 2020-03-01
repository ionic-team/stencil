import * as d from '@stencil/core/internal';
import { cstrs, hostRefs, moduleLoaded, styles } from './testing-constants';
import { flushAll, resetTaskQueue } from './testing-task-queue';
import { win } from './testing-window';


export const plt: d.PlatformRuntime = {
  $flags$: 0,
  $resourcesUrl$: '',
  $supportsShadow$: true,
  jmp: (h) => h(),
  raf: (h) => requestAnimationFrame(h),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};

export const cssVarShim: d.CssVarShim = false as any;
export const supportsListenerOptions = true;
export const supportsConstructibleStylesheets = false;
export const Context: any = {};

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

let isAutoApplyingChanges = false;
let autoApplyTimer: any = undefined;

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

export const registerComponents = (Cstrs: d.ComponentTestingConstructor[]) => {
  Cstrs.forEach(Cstr => {
    cstrs.set(Cstr.COMPILER_META.tagName, Cstr);
  });
};

export function registerModule(bundleId: string, Cstr: any) {
  moduleLoaded.set(bundleId, Cstr);
}

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
