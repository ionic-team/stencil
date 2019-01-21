import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { doc, win } from './client-window';


export const refs = (BUILD.refs ? new Map() : undefined);

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = (BUILD.exposeAppOnReady ? new Set() : undefined);

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

export const getElement = (ref: any) => refs.get(ref).elm;

export const getElmRef = (elm: d.HostElement, elmData?: d.ElementData) => {
  elmData = refs.get(elm);

  if (!elmData) {
    refs.set(elm, elmData = {
      elm: elm,
      instanceValues: new Map(),
      instance: BUILD.lazyLoad ? null : elm
    });
  }

  return elmData;
};

export const registerLazyInstance = (lazyInstance: any, elmData: d.ElementData) =>
  refs.set(elmData.instance = lazyInstance, elmData);


export const registerStyle = (styleId: string, styleText: string) => styles.set(styleId, styleText);
