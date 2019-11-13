
export const STENCIL_DEV_MODE = ['%c[STENCIL-DEV-MODE]', 'color:#4c47ff;font-weight: bold'];

export const consoleDevError = (...m: any[]) => console.error(...STENCIL_DEV_MODE, ...m);

export const consoleDevWarn = (...m: any[]) => console.warn(...STENCIL_DEV_MODE, ...m);

export const consoleDevInfo = (...m: any[]) => console.info(...STENCIL_DEV_MODE, ...m);

export const consoleError = (e: any) => console.error(e);
