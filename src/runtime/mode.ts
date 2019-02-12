import * as d from '@declarations';
import { getHostRef } from '@platform';

export type ResolutionHandler = (elm: d.HostElement) => string | null;
export const modeResolutionChain: ResolutionHandler[] = [];
export const setMode = (handler: ResolutionHandler) => modeResolutionChain.push(handler);
export const getMode = (ref: d.RuntimeRef) => getHostRef(ref).modeName;
export const computeMode = (elm: d.HostElement) => modeResolutionChain.map(h => h(elm)).find(m => !!m);
