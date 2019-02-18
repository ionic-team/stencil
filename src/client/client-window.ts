import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const win = window as any;

export const doc = document;

export const plt: d.PlatformRuntime = {};

if (BUILD.taskQueue) {
  plt.queueCongestion = 0;
  plt.queuePending = false;
}

export const supportsShadowDom = (BUILD.shadowDom) ? !!doc.documentElement.attachShadow : false;

export const supportsListenerOptions = (BUILD.hostListener) ?
function() {
  let supportsListenerOptions = false;
  try {
    (win as Window).addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
  return supportsListenerOptions;
}() : false;

