import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


export const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = new WeakMap();

export const rootAppliedStyles: d.RootAppliedStyleMap = (BUILD.style ? new WeakMap() : undefined);

export const onAppReadyCallbacks: any[] = [];

export const activelyProcessingCmps: d.ActivelyProcessingCmpMap = (BUILD.exposeAppOnReady ? new Set() : undefined);

export const getHostRef = (elm: d.RuntimeRef) =>
  hostRefs.get(elm);

export const registerLazyInstance = (lazyInstance: any, elmData: d.HostRef) =>
  hostRefs.set(elmData.lazyInstance = lazyInstance, elmData);
