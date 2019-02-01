import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const win = window as any;

export const doc = document;

export const plt: d.PlatformRuntime = {};

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

if (BUILD.hostListener) {
  plt.supportsListenerOptions = false;
}

// if (BUILD.exposeAppRegistry) {
//   (win['s-apps'] = win['s-apps'] || []).push(BUILD.appNamespace);
// }

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = new Set();

export const onAppReadyCallbacks: any[] = [];
