import { DomApi } from './interfaces';
import { NODE_TYPE } from './constants';


export const isDef = (v: any) => v !== undefined && v !== null;

export const isUndef = (v: any) => v === undefined || v === null;

export const isArray = (v: any): v is Array<any> => Array.isArray(v);

export const isObject = (v: any): v is Object => v !== null && typeof v === 'object';

export const isBoolean = (v: any): v is boolean => typeof v === 'boolean';

export const isString = (v: any): v is string => typeof v === 'string';

export const isNumber = (v: any): v is number => typeof v === 'number';

export const toLowerCase = (str: string) => str.toLowerCase();

export const toDashCase = (str: string) => str.replace(/([A-Z])/g, (g) => '-' + toLowerCase(g[0]));

export const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.substr(1);

export const dashToPascalCase = (word: string) => word.split('-').map((segment: string) => {
  segment = segment.toLocaleLowerCase();
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}).join('');

export const noop = (): any => {};

export function getElementReference(domApi: DomApi, elm: any, ref: string) {
  if (ref === 'child') {
    return elm.firstElementChild;
  }
  if (ref === 'parent') {
    return getParentElement(domApi, elm) || elm;
  }
  if (ref === 'body') {
    return domApi.$body;
  }
  if (ref === 'document') {
    return elm.ownerDocument;
  }
  if (ref === 'window') {
    return elm.ownerDocument.defaultView;
  }
  return elm;
}

export function getParentElement(domApi: DomApi, elm: Node, parentNode?: any): any {
  // if the parent node is a document fragment (shadow root)
  // then use the "host" property on it
  // otherwise use the parent node
  parentNode = domApi.$parentNode(elm);
  return parentNode && domApi.$nodeType(parentNode) === NODE_TYPE.DocumentFragment ? parentNode.host : parentNode;
}
