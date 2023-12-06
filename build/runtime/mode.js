import { getHostRef, modeResolutionChain } from '@platform';
// Private
export const computeMode = (elm) => modeResolutionChain.map((h) => h(elm)).find((m) => !!m);
// Public
export const setMode = (handler) => modeResolutionChain.push(handler);
export const getMode = (ref) => getHostRef(ref).$modeName$;
//# sourceMappingURL=mode.js.map