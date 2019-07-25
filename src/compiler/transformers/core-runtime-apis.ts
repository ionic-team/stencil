import * as d from '../../declarations';


export const ATTACH_SHADOW = '__stencil_attachShadow';
export const CREATE_EVENT = '__stencil_createEvent';
export const DEFINE_CUSTOM_ELEMENT = '__stencil_defineCustomElement';
export const GET_CONNECT = '__stencil_getConnect';
export const GET_CONTEXT = '__stencil_getContext';
export const GET_ELEMENT = '__stencil_getElement';
export const HOST = '__stencil_Host';
export const HTML_ELEMENT = 'HTMLElement';
export const PROXY_CUSTOM_ELEMENT = '__stencil_proxyCustomElement';
export const REGISTER_INSTANCE = '__stencil_registerInstance';
export const REGISTER_HOST = '__stencil_registerHost';
export const H = '__stencil_h';


export const RUNTIME_APIS = {
  attachShadow: `attachShadow as ${ATTACH_SHADOW}`,
  createEvent: `createEvent as ${CREATE_EVENT}`,
  defineCustomElement: `defineCustomElement as ${DEFINE_CUSTOM_ELEMENT}`,
  getConnect: `getConnect as ${GET_CONNECT}`,
  getContext: `getContext as ${GET_CONTEXT}`,
  getElement: `getElement as ${GET_ELEMENT}`,
  h: `h as ${H}`,
  legacyH: `h`,
  Host: `Host as ${HOST}`,
  HTMLElement: HTML_ELEMENT,
  proxyCustomElement: `proxyCustomElement as ${PROXY_CUSTOM_ELEMENT}`,
  registerHost: `registerHost as ${REGISTER_HOST}`,
  registerInstance: `registerInstance as ${REGISTER_INSTANCE}`,
};


export const addCoreRuntimeApi = (moduleFile: d.Module, coreRuntimeApi: string) => {
  if (!moduleFile.coreRuntimeApis.includes(coreRuntimeApi)) {
    moduleFile.coreRuntimeApis.push(coreRuntimeApi);
  }
};

export const addLegacyImports = (moduleFile: d.Module) => {
  addCoreRuntimeApi(moduleFile, RUNTIME_APIS.legacyH);
};
