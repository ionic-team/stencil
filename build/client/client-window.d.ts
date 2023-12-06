import type * as d from '../declarations';
export declare const win: Window;
export declare const doc: Document;
export declare const H: HTMLElement;
export declare const plt: d.PlatformRuntime;
export declare const setPlatformHelpers: (helpers: {
    jmp?: (c: any) => any;
    raf?: (c: any) => number;
    ael?: (el: any, eventName: string, listener: any, options: any) => void;
    rel?: (el: any, eventName: string, listener: any, options: any) => void;
    ce?: (eventName: string, opts?: any) => any;
}) => void;
export declare const supportsShadow: boolean;
export declare const supportsListenerOptions: boolean;
export declare const promiseResolve: (v?: any) => Promise<any>;
export declare const supportsConstructableStylesheets: boolean;
export { H as HTMLElement };
