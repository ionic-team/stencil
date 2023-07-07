export const IS_WINDOWS_ENV = process.platform === 'win32';

export const IS_CASE_SENSITIVE_FILE_NAMES = !IS_WINDOWS_ENV;

export const IS_BROWSER_ENV =
  typeof location !== 'undefined' && typeof navigator !== 'undefined' && typeof XMLHttpRequest !== 'undefined';

export const IS_WEB_WORKER_ENV =
  IS_BROWSER_ENV && typeof self !== 'undefined' && typeof (self as any).importScripts === 'function';

export const HAS_WEB_WORKER = IS_BROWSER_ENV && typeof Worker === 'function';

export const IS_FETCH_ENV = typeof fetch === 'function';
