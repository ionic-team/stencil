import { addHostEventListeners } from '@runtime';
let customError;
export const cmpModules = new Map();
const getModule = (tagName) => {
    if (typeof tagName === 'string') {
        tagName = tagName.toLowerCase();
        const cmpModule = cmpModules.get(tagName);
        if (cmpModule != null) {
            return cmpModule[tagName];
        }
    }
    return null;
};
export const loadModule = (cmpMeta, _hostRef, _hmrVersionId) => {
    return getModule(cmpMeta.$tagName$);
};
export const isMemberInElement = (elm, memberName) => {
    if (elm != null) {
        if (memberName in elm) {
            return true;
        }
        const cstr = getModule(elm.nodeName);
        if (cstr != null) {
            const hostRef = cstr;
            if (hostRef != null && hostRef.cmpMeta != null && hostRef.cmpMeta.$members$ != null) {
                return memberName in hostRef.cmpMeta.$members$;
            }
        }
    }
    return false;
};
export const registerComponents = (Cstrs) => {
    for (const Cstr of Cstrs) {
        // using this format so it follows exactly how client-side modules work
        const exportName = Cstr.cmpMeta.$tagName$;
        cmpModules.set(exportName, {
            [exportName]: Cstr,
        });
    }
};
export const win = window;
export const doc = win.document;
export const readTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
export const writeTask = (cb) => {
    process.nextTick(() => {
        try {
            cb();
        }
        catch (e) {
            consoleError(e);
        }
    });
};
const resolved = /*@__PURE__*/ Promise.resolve();
export const nextTick = (cb) => resolved.then(cb);
const defaultConsoleError = (e) => {
    if (e != null) {
        console.error(e.stack || e.message || e);
    }
};
export const consoleError = (e, el) => (customError || defaultConsoleError)(e, el);
export const consoleDevError = (..._) => {
    /* noop for hydrate */
};
export const consoleDevWarn = (..._) => {
    /* noop for hydrate */
};
export const consoleDevInfo = (..._) => {
    /* noop for hydrate */
};
export const setErrorHandler = (handler) => (customError = handler);
export const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
    ce: (eventName, opts) => new win.CustomEvent(eventName, opts),
};
export const setPlatformHelpers = (helpers) => {
    Object.assign(plt, helpers);
};
export const supportsShadow = false;
export const supportsListenerOptions = false;
export const supportsConstructableStylesheets = false;
const hostRefs = new WeakMap();
export const getHostRef = (ref) => hostRefs.get(ref);
export const registerInstance = (lazyInstance, hostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);
export const registerHost = (elm, cmpMeta) => {
    const hostRef = {
        $flags$: 0,
        $cmpMeta$: cmpMeta,
        $hostElement$: elm,
        $instanceValues$: new Map(),
        $renderCount$: 0,
    };
    hostRef.$onInstancePromise$ = new Promise((r) => (hostRef.$onInstanceResolve$ = r));
    hostRef.$onReadyPromise$ = new Promise((r) => (hostRef.$onReadyResolve$ = r));
    elm['s-p'] = [];
    elm['s-rc'] = [];
    addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false);
    return hostRefs.set(elm, hostRef);
};
export const Build = {
    isDev: false,
    isBrowser: false,
    isServer: true,
    isTesting: false,
};
export const styles = new Map();
export const modeResolutionChain = [];
export { hAsync as h } from './h-async';
export { hydrateApp } from './hydrate-app';
export { BUILD, Env, NAMESPACE } from '@app-data';
export { addHostEventListeners, bootstrapLazy, connectedCallback, createEvent, defineCustomElement, disconnectedCallback, forceModeUpdate, forceUpdate, Fragment, getAssetPath, getElement, getMode, getRenderingRef, getValue, Host, insertVdomAnnotations, parsePropertyValue, postUpdateComponent, proxyComponent, proxyCustomElement, renderVdom, setAssetPath, setMode, setNonce, setValue, } from '@runtime';
//# sourceMappingURL=index.js.map