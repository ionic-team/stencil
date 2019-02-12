
export const CREATE_EVENT = '__stencil_createEvent';
export const GET_CONNECT = '__stencil_getConnect';
export const GET_CONTEXT = '__stencil_getContext';
export const GET_ELEMENT = '__stencil_getElement';
export const REGISTER_INSTANCE = '__stencil_registerInstance';
export const REGISTER_HOST = '__stencil_registerHost';
export const H = '__stencil_h';

export const COMMON_IMPORTS = [
  `createEvent as ${CREATE_EVENT}`,
  `getConnect as ${GET_CONNECT}`,
  `getContext as ${GET_CONTEXT}`,
  `getElement as ${GET_ELEMENT}`,
  `h as ${H}`,
];
