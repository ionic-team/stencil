interface SetPlatformOptions {
    raf?: (c: FrameRequestCallback) => number;
    ael?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
    rel?: (el: EventTarget, eventName: string, listener: EventListenerOrEventListenerObject, options: boolean | AddEventListenerOptions) => void;
    ce?: (eventName: string, opts?: any) => CustomEvent;
}
export declare const setPlatformOptions: (opts: SetPlatformOptions) => import("../declarations").PlatformRuntime & SetPlatformOptions;
export {};
