import type * as d from '../declarations';
export declare const attachToAncestor: (hostRef: d.HostRef, ancestorComponent?: d.HostElement) => void;
export declare const scheduleUpdate: (hostRef: d.HostRef, isInitialLoad: boolean) => void | Promise<void>;
export declare const getRenderingRef: () => any;
export declare const postUpdateComponent: (hostRef: d.HostRef) => void;
export declare const forceUpdate: (ref: any) => boolean;
export declare const appDidLoad: (who: string) => void;
/**
 * Allows to safely call a method, e.g. `componentDidLoad`, on an instance,
 * e.g. custom element node. If a build figures out that e.g. no component
 * has a `componentDidLoad` method, the instance method gets removed from the
 * output bundle and this function returns `undefined`.
 * @param instance any object that may or may not contain methods
 * @param method method name
 * @param arg single arbitrary argument
 * @returns result of method call if it exists, otherwise `undefined`
 */
export declare const safeCall: (instance: any, method: string, arg?: any) => any;
