import * as d from '../declarations';

export const refs: d.RefMap =  (BUILD.refs ? new WeakMap() : undefined);

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

export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const appMode = (BUILD.mode ? document.documentElement.getAttribute('mode') : undefined);

export const supportsShadowDom = (BUILD.shadowDom ? !!document.documentElement.attachShadow : undefined);

export const plt: d.PlatformRuntime = {
  isTmpDisconnected: false
};
