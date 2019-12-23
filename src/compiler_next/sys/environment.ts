
export const IS_NODE_ENV = (
  typeof global !== 'undefined' &&
  typeof require === 'function' &&
  !!global.process &&
  Array.isArray(global.process.argv) &&
  typeof __filename === 'string' &&
  (!((global as any) as Window).origin || typeof ((global as any) as Window).origin !== 'string')
);

export const IS_WEB_WORKER_ENV = (
  typeof self !== 'undefined' &&
  typeof (self as any).importScripts === 'function' &&
  typeof XMLHttpRequest !== 'undefined' &&
  typeof location !== 'undefined' &&
  typeof navigator !== 'undefined'
);

export const IS_FETCH_ENV = (
  typeof fetch === 'function'
);

export const HAS_FETCH_CACHE = (
  IS_FETCH_ENV &&
  typeof caches !== 'undefined' &&
  typeof caches.match === 'function'
);

export const IS_WINDOWS_ENV = (
  IS_NODE_ENV &&
  global.process.platform === 'win32'
);

export const IS_CASE_SENSITIVE_FILE_NAMES = (
  !IS_WINDOWS_ENV
);

export const requireFunc = (path: string) => (typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require)(path);

declare const __webpack_require__: (path: string) => any;
declare const __non_webpack_require__: (path: string) => any;
