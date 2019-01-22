import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const win = window as any;

export const doc = document;

export const plt: d.PlatformRuntime = {
  isTmpDisconnected: false
};

if (BUILD.mode) {
  plt.appMode = doc.documentElement.getAttribute('mode');
}

if (BUILD.taskQueue) {
  plt.queueCongestion = 0;
  plt.queuePending = false;
}

if (BUILD.shadowDom) {
  plt.supportsShadowDom = !!doc.documentElement.attachShadow;
}

if (BUILD.exposeAppRegistry) {
  (win['s-apps'] = win['s-apps'] || []).push(BUILD.appNamespace);
}

if (BUILD.hostListener) {
  plt.supportsListenerOptions = false;
}

if (BUILD.hostListener) {
  try {
    (win as Window).addEventListener('e', null,
      Object.defineProperty({}, 'passive', {
        get() { plt.supportsListenerOptions = true; }
      })
    );
  } catch (e) {}
}
