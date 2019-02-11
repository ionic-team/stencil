import * as d from '@declarations';

export type ResolutionHandler = (elm: d.HostElement) => string | null;
export const modeResolutionChain: ResolutionHandler[] = [];
export const setMode = (handler: ResolutionHandler) => modeResolutionChain.push(handler);
export const getMode = (elm: d.HostElement) => modeResolutionChain.map(h => h(elm)).find(m => !!m);
