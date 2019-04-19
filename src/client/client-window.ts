import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


export const win = window;

export const doc = document;

export const getHead = (_?: any) => doc.head;

export const plt: d.PlatformRuntime = {};

if (BUILD.taskQueue) {
  plt.$importMetaUrl$ = '/';
  plt.$queueCongestion$ = 0;
  plt.$queuePending$ = false;
  plt.$queueAsync$ = false;
}

export const supportsShadowDom = (BUILD.shadowDom) ? !!doc.documentElement.attachShadow : false;

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


export const supportsConstructibleStylesheets = /*@__PURE__*/(() => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {}
  return false;
})();
