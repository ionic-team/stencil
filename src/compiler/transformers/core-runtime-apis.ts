import * as d from '../../declarations';


export const ATTACH_SHADOW = '__stencil_attachShadow';
export const CREATE_EVENT = '__stencil_createEvent';
export const GET_CONNECT = '__stencil_getConnect';
export const GET_CONTEXT = '__stencil_getContext';
export const GET_ELEMENT = '__stencil_getElement';
export const HOST = '__stencil_Host';
export const HTML_ELEMENT = 'HTMLElement';
export const REGISTER_INSTANCE = '__stencil_registerInstance';
export const REGISTER_HOST = '__stencil_registerHost';
export const PROXY_COMPONENT = '__stencil_proxyComponent';
export const H = '__stencil_h';


export const RUNTIME_APIS = {
  attachShadow: `attachShadow as ${ATTACH_SHADOW}`,
  createEvent: `createEvent as ${CREATE_EVENT}`,
  getConnect: `getConnect as ${GET_CONNECT}`,
  getContext: `getContext as ${GET_CONTEXT}`,
  getElement: `getElement as ${GET_ELEMENT}`,
  h: `h as ${H}`,
  Host: `Host as ${HOST}`,
  HTMLElement: HTML_ELEMENT,
  registerHost: `registerHost as ${REGISTER_HOST}`,
  registerInstance: `registerInstance as ${REGISTER_INSTANCE}`,
};


export const addCoreRuntimeApi = (moduleFile: d.Module, coreRuntimeApi: string) => {
  if (!moduleFile.coreRuntimeApis.includes(coreRuntimeApi)) {
    moduleFile.coreRuntimeApis.push(coreRuntimeApi);
  }
};
