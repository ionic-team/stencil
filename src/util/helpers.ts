
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

export function getElementReference(elm: any, ref: string) {
  if (ref === 'child') {
    return elm.firstElementChild;
  }
  if (ref === 'parent') {
    return getParentElement(elm) || elm;
  }
  if (ref === 'body') {
    return elm.ownerDocument.body;
  }
  if (ref === 'document') {
    return elm.ownerDocument;
  }
  if (ref === 'window') {
    return elm.ownerDocument.defaultView;
  }
  return elm;
}

export function getParentElement(elm: any): any {
  if (elm.parentElement) {
    // normal element with a parent element
    return elm.parentElement;
  }
  if (elm.parentNode && elm.parentNode.host) {
    // shadow dom's document fragment
    return elm.parentNode.host;
  }
}
