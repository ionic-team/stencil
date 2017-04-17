
export function isDef(s: any): boolean { return s !== undefined && s !== null; }

export function isUndef(s: any): boolean { return s === undefined; }

export function isArray(val: any): val is Array<any> { return (!!val) && (val.constructor === Array); }

export function isObject(val: any): val is Object { return typeof val === 'object'; }

export function isBoolean(val: any): val is (boolean) { return typeof val === 'boolean'; }

export function isString(val: any): val is (string) { return typeof val === 'string'; }

export function isNumber(val: any): val is (number) { return typeof val === 'number'; }

export function isFunction(val: any): val is (Function) { return typeof val === 'function'; }

export function isStringOrNumber(s: any): s is (string | number) {
  return isString(s) || isNumber(s);
}

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function toDashCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());
}

export function noop(){};
