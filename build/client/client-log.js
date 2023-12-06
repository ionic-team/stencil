import { BUILD } from '@app-data';
let customError;
export const consoleError = (e, el) => (customError || console.error)(e, el);
export const STENCIL_DEV_MODE = BUILD.isTesting
    ? ['STENCIL:'] // E2E testing
    : [
        '%cstencil',
        'color: white;background:#4c47ff;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    ];
export const consoleDevError = (...m) => console.error(...STENCIL_DEV_MODE, ...m);
export const consoleDevWarn = (...m) => console.warn(...STENCIL_DEV_MODE, ...m);
export const consoleDevInfo = (...m) => console.info(...STENCIL_DEV_MODE, ...m);
export const setErrorHandler = (handler) => (customError = handler);
//# sourceMappingURL=client-log.js.map