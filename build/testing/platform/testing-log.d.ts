import type * as d from '../../declarations';
export declare const consoleError: d.ErrorHandler;
export declare const consoleDevError: (...e: any[]) => void;
export declare const consoleDevWarn: (...args: any[]) => void;
export declare const consoleDevInfo: (..._: any[]) => void;
export declare const setErrorHandler: (handler: d.ErrorHandler | undefined) => d.ErrorHandler;
