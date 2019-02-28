import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const getWindow = (_?: any) => window;

export const getDocument = (_?: any) => document;

export const getHead = (_?: any) => getDocument().head;


export const plt: d.PlatformRuntime = {};

if (BUILD.taskQueue) {
  plt.queueCongestion = 0;
  plt.queuePending = false;
}

export const supportsShadowDom = (BUILD.shadowDom) ? !!getDocument().documentElement.attachShadow : false;

export const supportsListenerOptions = (BUILD.hostListener) ?
function() {
  let supportsListenerOptions = false;
  try {
    getWindow().addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
  return supportsListenerOptions;
}() : false;

