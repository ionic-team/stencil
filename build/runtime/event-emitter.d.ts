import type * as d from '../declarations';
export declare const createEvent: (ref: d.RuntimeRef, name: string, flags: number) => {
    emit: (detail: any) => CustomEvent<any>;
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */
export declare const emitEvent: (elm: EventTarget, name: string, opts?: CustomEventInit) => CustomEvent<any>;
