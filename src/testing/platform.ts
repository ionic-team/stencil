import * as d from '@declarations';
import { resetTaskQueue } from './testing-task-queue';
import { setupGlobal } from '@mock-doc';

export * from './testing-task-queue';


export const consoleError = (e: any) => console.error(e);

export const win = setupGlobal(global);

export const doc = win.document;

export const refs = new Map();

export const rootAppliedStyles: d.RootAppliedStyleMap = new WeakMap();

export const styles: d.StyleMap = new Map();

export const plt: d.PlatformRuntime = {
  appMode: null,
  isTmpDisconnected: false,
  queueCongestion: 0,
  queuePending: false,
  supportsShadowDom: true
};

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = new Set();

export function resetPlatform() {
  win.$reset();
  refs.clear();
  styles.clear();
  plt.appMode = null;
  plt.isTmpDisconnected = false;
  plt.supportsShadowDom = true;

  onAppReadyCallbacks.length = 0;
  activelyProcessingCmps.clear();

  resetTaskQueue();
}

export const getElement = (ref: any) => refs.get(ref).elm;

export const getElmRef = (elm: d.HostElement, elmData?: d.ElementData) => {
  elmData = refs.get(elm);

  if (!elmData) {
    refs.set(elm, elmData = {
      elm: elm,
      instanceValues: new Map(),
      instance: elm
    });
  }

  return elmData;
};

export const registerLazyInstance = (lazyInstance: any, elmData: d.ElementData) =>
  refs.set(elmData.instance = lazyInstance, elmData);


export const registerStyle = (styleId: string, styleText: string) => styles.set(styleId, styleText);
