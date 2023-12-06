import type * as d from '../declarations';
export declare const consoleError: d.ErrorHandler;
export declare const STENCIL_DEV_MODE: string[];
export declare const consoleDevError: (...m: any[]) => void;
export declare const consoleDevWarn: (...m: any[]) => void;
export declare const consoleDevInfo: (...m: any[]) => void;
export declare const setErrorHandler: (handler: d.ErrorHandler) => d.ErrorHandler;
