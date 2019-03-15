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

export const supportsListenerOptions = (BUILD.hostListener) ? (() => {
  let supportsListenerOptions = false;
  try {
    getWin().addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
  return supportsListenerOptions;
})() : false;


export const supportsConstructibleStylesheets = BUILD.style ? (() => {
  try {
    new CSSStyleSheet();
    return true;
  } catch (e) {}
  return false;
})() : false;
