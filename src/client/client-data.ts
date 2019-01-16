import * as d from '../declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { doc, win } from './client-window';

export const refs = (BUILD.refs ? new Map() : undefined);

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = (BUILD.exposeAppOnReady ? new Set() : undefined);

export const queueDomReads: d.RafCallback[] = [];
export const queueDomWrites: d.RafCallback[] = [];
export const queueDomWritesLow: d.RafCallback[] = [];

export const resolved = (BUILD.taskQueue ? Promise.resolve() : undefined);

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
