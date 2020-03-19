import * as d from '../declarations';
import { getHostRef, modeResolutionChain } from '@platform';

// Private
export const computeMode = (elm: d.HostElement) => modeResolutionChain.map(h => h(elm)).find(m => !!m);

// Public
export const setMode = (handler: d.ResolutionHandler) => modeResolutionChain.push(handler);
export const getMode = (ref: d.RuntimeRef) => getHostRef(ref).$modeName$;
