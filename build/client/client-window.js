import { BUILD } from '@app-data';
export const win = typeof window !== 'undefined' ? window : (globalThis || {});
export const doc = win.document || { head: {} };
export const H = (win.HTMLElement || class {
});
export const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
    ce: (eventName, opts) => new CustomEvent(eventName, opts),
};
export const setPlatformHelpers = (helpers) => {
    Object.assign(plt, helpers);
};
export const supportsShadow = 
// TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
BUILD.shadowDomShim && BUILD.shadowDom
    ? /*@__PURE__*/ (() => (doc.head.attachShadow + '').indexOf('[native') > -1)()
    : true;
export const supportsListenerOptions = /*@__PURE__*/ (() => {
    let supportsListenerOptions = false;
    try {
        doc.addEventListener('e', null, Object.defineProperty({}, 'passive', {
            get() {
                supportsListenerOptions = true;
            },
        }));
    }
    catch (e) { }
    return supportsListenerOptions;
})();
export const promiseResolve = (v) => Promise.resolve(v);
export const supportsConstructableStylesheets = BUILD.constructableCSS
    ? /*@__PURE__*/ (() => {
        try {
            new CSSStyleSheet();
            return typeof new CSSStyleSheet().replaceSync === 'function';
        }
        catch (e) { }
        return false;
    })()
    : false;
export { H as HTMLElement };
//# sourceMappingURL=client-window.js.map