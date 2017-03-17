
export function isDef(s: any): boolean { return s !== undefined && s !== null; }

export function isUndef(s: any): boolean { return s === undefined; }

export const isArray = Array.isArray;

export function isPrimitive(s: any): s is (string | number) {
  return isString(s) || isNumber(s);
}

export function isBoolean(val: any): val is (boolean) { return typeof val === 'boolean'; }

export function isString(val: any): val is (string) { return typeof val === 'string'; }

export function isNumber(val: any): val is (number) { return typeof val === 'number'; }

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function getStaticComponentDir(doc: HTMLDocument) {
  let staticDirEle = <HTMLScriptElement>doc.querySelector('script[data-static-dir]');
  if (staticDirEle) {
    return staticDirEle.dataset['staticDir'];
  }

  const scriptElms = document.getElementsByTagName('script');
  staticDirEle = scriptElms[scriptElms.length - 1];

  const paths = staticDirEle.src.split('/');
  paths.pop();

  return staticDirEle.dataset['staticDir'] = paths.join('/') + '/';
}
