import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


export const getWin = (_?: any) => window;

export const getDoc = (_?: any) => document;

export const getHead = (_?: any) => getDoc().head;

export const plt: d.PlatformRuntime = {};

if (BUILD.taskQueue) {
  plt.$queueCongestion$ = 0;
  plt.$queuePending$ = false;
  plt.$queueAsync$ = false;
}

export const supportsShadowDom = (BUILD.shadowDom) ? !!getDoc().documentElement.attachShadow : false;

export const supportsListenerOptions = /*@__PURE__*/(() => {
  let supportsListenerOptions = false;
  try {
    getWin().addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
  return supportsListenerOptions;
})();


export const supportsConstructibleStylesheets = /*@__PURE__*/(() => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {}
  return false;
})();
