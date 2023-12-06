import type * as d from '@stencil/core/internal';
export declare let supportsShadow: boolean;
export declare const plt: d.PlatformRuntime;
export declare const setPlatformHelpers: (helpers: {
    jmp?: (c: any) => any;
    raf?: (c: any) => number;
    ael?: (el: any, eventName: string, listener: any, options: any) => void;
    rel?: (el: any, eventName: string, listener: any, options: any) => void;
    ce?: (eventName: string, opts?: any) => any;
}) => void;
export declare const supportsListenerOptions = true;
export declare const supportsConstructableStylesheets = false;
/**
 * Helper function to programmatically set shadow DOM support in testing scenarios.
 *
 * This function modifies the global {@link supportsShadow} variable.
 *
 * @param supports `true` if shadow DOM is supported, `false` otherwise
 */
export declare const setSupportsShadowDom: (supports: boolean) => void;
/**
 * Resets global testing variables and collections, so that a new set of tests can be started with a "clean slate".
 *
 * It is expected that this function be called between spec tests, and should be automatically configured by Stencil to
 * do so.
 *
 * @param defaults default options for the {@link d.PlatformRuntime} used during testing. The values in this object
 * with be assigned to the global {@link plt} object used during testing.
 */
export declare function resetPlatform(defaults?: Partial<d.PlatformRuntime>): void;
/**
 * Cancels the JavaScript task of automatically flushing the render queue & applying DOM changes in tests
 */
export declare function stopAutoApplyChanges(): void;
/**
 * Creates a JavaScript task to flush the render pipeline without the user having to do so manually in their tests.
 */
export declare function startAutoApplyChanges(): Promise<void>;
/**
 * Registers a collection of component constructors with the global {@link cstrs} data structure
 * @param Cstrs the component constructors to register
 */
export declare const registerComponents: (Cstrs: d.ComponentTestingConstructor[]) => void;
/**
 * Add the provided component constructor, `Cstr`, to the {@link moduleLoaded} mapping, using the provided `bundleId`
 * as the key
 * @param bundleId the bundle identifier to use to store/retrieve the component constructor
 * @param Cstr the component constructor to store
 */
export declare function registerModule(bundleId: string, Cstr: d.ComponentTestingConstructor): void;
export declare const isMemberInElement: (elm: any, memberName: string) => boolean;
