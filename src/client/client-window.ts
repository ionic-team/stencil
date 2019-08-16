import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


export const win = window;

export const doc = document;

export const H = HTMLElement;

export const plt: d.PlatformRuntime = {
  $flags$: 0,
  $resourcesUrl$: '',
  jmp: (h) => h(),
  raf: (h) => requestAnimationFrame(h),
  ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
  rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
};

export const supportsShadowDom = (BUILD.shadowDom) ? /*@__PURE__*/(() => !!doc.documentElement.attachShadow)() : false;

export const supportsListenerOptions = /*@__PURE__*/(() => {
  let supportsListenerOptions = false;
  try {
    doc.addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
  return supportsListenerOptions;
})();


export const supportsConstructibleStylesheets = BUILD.constructableCSS ? /*@__PURE__*/(() => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {}
  return false;
})() : false;

export {H as HTMLElement};
