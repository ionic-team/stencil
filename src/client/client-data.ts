import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const refs = (BUILD.refs ? new Map() : undefined);

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = (BUILD.exposeAppOnReady ? new Set() : undefined);

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
