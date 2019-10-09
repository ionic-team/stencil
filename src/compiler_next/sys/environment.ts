
export const IS_NODE_ENV = (typeof global !== 'undefined' && typeof require === 'function' && (!((global as any) as Window).origin || typeof ((global as any) as Window).origin !== 'string'));

export const IS_WEB_WORKER_ENV = (typeof self !== 'undefined' && typeof (self as any).importScripts === 'function' && typeof XMLHttpRequest !== 'undefined');

export const IS_FETCH_ENV = (typeof fetch === 'function');

export const IS_LOCATION_ENV = (typeof location !== 'undefined' && typeof location.href === 'string');

export const requireFunc = (path: string) => {
  const reqFn = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  return reqFn(path);
};

declare const __webpack_require__: (path: string) => any;
declare const __non_webpack_require__: (path: string) => any;
