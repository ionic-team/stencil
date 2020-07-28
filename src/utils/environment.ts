import { noop } from './helpers';

export const IS_DENO_ENV = typeof Deno !== 'undefined';

export const IS_NODE_ENV =
  !IS_DENO_ENV &&
  typeof global !== 'undefined' &&
  typeof require === 'function' &&
  !!global.process &&
  typeof __filename === 'string' &&
  (!((global as any) as Window).origin || typeof ((global as any) as Window).origin !== 'string');

export const OS_PLATFORM = IS_NODE_ENV ? global.process.platform : IS_DENO_ENV ? (globalThis as any).Deno.build.os : '';

export const IS_DENO_WINDOWS_ENV = IS_DENO_ENV && Deno.build.os === 'windows';

export const IS_NODE_WINDOWS_ENV = IS_NODE_ENV && global.process.platform === 'win32';

export const IS_WINDOWS_ENV = IS_DENO_WINDOWS_ENV || IS_NODE_WINDOWS_ENV;

export const IS_CASE_SENSITIVE_FILE_NAMES = !IS_WINDOWS_ENV;

/** Either browser main thread or web worker */
export const IS_BROWSER_ENV = typeof location !== 'undefined' && typeof navigator !== 'undefined' && typeof XMLHttpRequest !== 'undefined';

export const IS_WEB_WORKER_ENV = IS_BROWSER_ENV && typeof self !== 'undefined' && typeof (self as any).importScripts === 'function';

export const HAS_WEB_WORKER = IS_BROWSER_ENV && typeof Worker === 'function';

export const IS_FETCH_ENV = typeof fetch === 'function';

export const requireFunc = (path: string) => (typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require)(path);

export const getCurrentDirectory: () => string = IS_NODE_ENV ? process.cwd : IS_DENO_ENV ? Deno.cwd : () => '/';

export const exit: (exitCode?: number) => void = IS_NODE_ENV ? process.exit : IS_DENO_ENV ? Deno.exit : noop;

declare const __webpack_require__: (path: string) => any;
declare const __non_webpack_require__: (path: string) => any;
declare const Deno: any;
