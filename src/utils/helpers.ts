import * as d from '../declarations';
import { normalizePath } from './normalize-path';

export const isDef = (v: any) => v != null;

export const toLowerCase = (str: string) => str.toLowerCase();

export const toDashCase = (str: string) => toLowerCase(str.replace(/([A-Z0-9])/g, g => ' ' + g[0]).trim().replace(/ /g, '-'));

export const dashToPascalCase = (str: string) => toLowerCase(str).split('-').map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');

export const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const noop = (): any => { /* noop*/ };

export const isComplexType = (o: any) => {
  // https://jsperf.com/typeof-fn-object/5
  o = typeof o;
  return o === 'object' || o === 'function';
};

export const sortBy = <T>(array: T[], prop: ((item: T) => string | number)) => {
  return array.slice().sort((a, b) => {
    const nameA = prop(a);
    const nameB = prop(b);
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
};

export const flatOne = <T>(array: T[][]): T[] => {
  if (array.flat) {
    return array.flat(1);
  }
  return array.reduce((result, item) => {
    result.push(...item);
    return result;
  }, [] as T[]);
};

export const unique = <T>(array: T[], predicate: (item: T) => any = (i) => i): T[] => {
  const set = new Set();
  return array.filter(item => {
    const key = predicate(item);
    if (key == null) {
      return true;
    }
    if (set.has(key)) {
      return false;
    }
    set.add(key);
    return true;
  });
};

export const fromEntries = <V>(entries: IterableIterator<[string, V]>) => {
  const object: { [key: string]: V} = {};
  for (const [key, value] of entries) {
    object[key] = value;
  }
  return object;
};


export const relativeImport = (config: d.Config, pathFrom: string, pathTo: string, ext?: string, addPrefix = true) => {
  let relativePath = config.sys.path.relative(config.sys.path.dirname(pathFrom), config.sys.path.dirname(pathTo));
  if (addPrefix) {
    if (relativePath === '') {
      relativePath = '.';
    } else if (relativePath[0] !== '.') {
      relativePath = './' + relativePath;
    }
  }
  return normalizePath(`${relativePath}/${config.sys.path.basename(pathTo, ext)}`);
};

export const pluck = (obj: {[key: string]: any }, keys: string[]) => {
  return keys.reduce((final, key) => {
    if (obj[key]) {
      final[key] = obj[key];
    }
    return final;
  }, {} as {[key: string]: any});
};

export const isObject = (val: Object) => {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};
