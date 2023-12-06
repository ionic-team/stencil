import type * as d from '../../declarations';
export declare const CREATE_EVENT = "__stencil_createEvent";
export declare const DEFINE_CUSTOM_ELEMENT = "__stencil_defineCustomElement";
export declare const GET_ELEMENT = "__stencil_getElement";
export declare const HOST = "__stencil_Host";
export declare const HTML_ELEMENT = "HTMLElement";
export declare const PROXY_CUSTOM_ELEMENT = "__stencil_proxyCustomElement";
export declare const REGISTER_INSTANCE = "__stencil_registerInstance";
export declare const REGISTER_HOST = "__stencil_registerHost";
export declare const H = "__stencil_h";
export declare const RUNTIME_APIS: {
    createEvent: string;
    defineCustomElement: string;
    getElement: string;
    h: string;
    legacyH: string;
    Host: string;
    HTMLElement: string;
    proxyCustomElement: string;
    registerHost: string;
    registerInstance: string;
};
/**
 * Update a Stencil Module entity to include a {@link RUNTIME_APIS} entry if it does not already exist.
 * This allows Stencil to keep `moduleFile` easily serializable, where this helper function treats the data structure
 * that stores {@link Module#coreRuntimeApis} similar to a JS `Set`.
 * @param moduleFile the Module entity to update
 * @param coreRuntimeApi the API to add to the provided module
 */
export declare const addCoreRuntimeApi: (moduleFile: d.Module, coreRuntimeApi: string) => void;
/**
 * Update a Stencil Module entity to include a {@link RUNTIME_APIS} entry for a specific output target, if it does not
 * already exist.
 * This allows Stencil to keep `moduleFile` easily serializable, where this helper function treats the data structure
 * that stores {@link Module#outputTargetCoreRuntimeApis} similar to a JS `Set`.
 * @param moduleFile the Module entity to update
 * @param outputTarget the output target to assign the provided runtime api under
 * @param coreRuntimeApi the API to add to the provided module
 */
export declare const addOutputTargetCoreRuntimeApi: (moduleFile: d.Module, outputTarget: d.OutputTarget['type'], coreRuntimeApi: string) => void;
export declare const addLegacyApis: (moduleFile: d.Module) => void;
