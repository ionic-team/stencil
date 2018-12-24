import * as d from '../declarations';

export const refs: d.RefMap = new WeakMap();

export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const appMode = (BUILD.mode ? document.documentElement.getAttribute('mode') : undefined);

export const supportsShadowDom = (BUILD.shadowDom ? !!document.documentElement.attachShadow : undefined);

export const plt: d.PlatformRuntime = {
  isTmpDisconnected: false
};
