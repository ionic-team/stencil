
export function isDef(s: any): boolean { return s !== undefined && s !== null; }

export function isUndef(s: any): boolean { return s === undefined; }

export const isArray = Array.isArray;

export function isPrimitive(s: any): s is (string | number) {
  return typeof s === 'string' || typeof s === 'number';
}

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function defineElements(win: any, elements: {[tag: string]: Object}) {
  const tags = Object.keys(elements);
  for (var i = 0, l = tags.length; i < l; i++) {
    win.customElements.define(tags[i], elements[tags[i]]);
  }
}
