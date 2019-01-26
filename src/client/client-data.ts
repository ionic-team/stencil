import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const hostRefs: WeakMap<any, d.HostRef> = new WeakMap();

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const styles: d.StyleMap = (BUILD.style ? new Map() : undefined);

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = (BUILD.exposeAppOnReady ? new Set() : undefined);

// export const getElement = (ref: any) => hostDataMap.get(ref).elm;

export const getHostRef = (elm: d.HostElement, hostRef?: d.HostRef) => {
  hostRef = hostRefs.get(elm);

  if (!hostRef) {
    hostRefs.set(elm, hostRef = {
      instanceValues: new Map()
    });
  }

  return hostRef;
};

export const registerLazyInstance = (lazyInstance: any, elmData: d.HostRef) =>
  hostRefs.set(elmData.lazyInstance = lazyInstance, elmData);


export const registerStyle = (styleId: string, styleText: string) => styles.set(styleId, styleText);
