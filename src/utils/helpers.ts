export const isDef = (v: any) => v != null;

export const toLowerCase = (str: string) => str.toLowerCase();

export const toDashCase = (str: string) =>
  toLowerCase(
    str
      .replace(/([A-Z0-9])/g, g => ' ' + g[0])
      .trim()
      .replace(/ /g, '-'),
  );

export const dashToPascalCase = (str: string) =>
  toLowerCase(str)
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

export const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const noop = (): any => {
  /* noop*/
};

export const isComplexType = (o: any) => {
  // https://jsperf.com/typeof-fn-object/5
  o = typeof o;
  return o === 'object' || o === 'function';
};

export const sortBy = <T>(array: T[], prop: (item: T) => string | number) => {
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

export const unique = <T>(array: T[], predicate: (item: T) => any = i => i): T[] => {
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
  const object: { [key: string]: V } = {};
  for (const [key, value] of entries) {
    object[key] = value;
  }
  return object;
};

export const pluck = (obj: { [key: string]: any }, keys: string[]) => {
  return keys.reduce((final, key) => {
    if (obj[key]) {
      final[key] = obj[key];
    }
    return final;
  }, {} as { [key: string]: any });
};

export const isBoolean = (v: any): v is boolean => typeof v === 'boolean';
export const isDefined = (v: any) => v !== null && v !== undefined;
export const isUndefined = (v: any) => v === null || v === undefined;
export const isFunction = (v: any): v is boolean => typeof v === 'function';
export const isNumber = (v: any): v is boolean => typeof v === 'number';
export const isObject = (val: Object) => val != null && typeof val === 'object' && Array.isArray(val) === false;
export const isString = (v: any): v is string => typeof v === 'string';
export const isIterable = (v: any): v is Iterable<any> => isDefined(v) && isFunction(v[Symbol.iterator]);
export const isPromise = (v: any): v is Promise<any> => !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
