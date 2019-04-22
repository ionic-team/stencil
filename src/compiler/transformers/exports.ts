
export const CREATE_EVENT = '__stencil_createEvent';
export const HOST = '__stencil_Host';
export const GET_CONNECT = '__stencil_getConnect';
export const GET_CONTEXT = '__stencil_getContext';
export const GET_ELEMENT = '__stencil_getElement';
export const REGISTER_INSTANCE = '__stencil_registerInstance';
export const REGISTER_HOST = '__stencil_registerHost';
export const CONNECTED_CALLBACK = '__stencil_connectedCallback';
export const PROXY_COMPONENT = '__stencil_proxyComponent';
export const H = '__stencil_h';
export const ATTACH_SHADOW = '__stencil_attachShadow';

export const COMMON_IMPORTS = [
  `createEvent as ${CREATE_EVENT}`,
  `getConnect as ${GET_CONNECT}`,
  `getContext as ${GET_CONTEXT}`,
  `getElement as ${GET_ELEMENT}`,
  `Host as ${HOST}`,
  `h as ${H}`,
];
