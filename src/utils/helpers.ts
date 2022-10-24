export const isDef = (v: any) => v != null;

/**
 * Convert a string from PascalCase to dash-case
 *
 * @param str the string to convert
 * @returns a converted string
 */
export const toDashCase = (str: string): string =>
  str
    .replace(/([A-Z0-9])/g, (match) => ` ${match[0]}`)
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase();

/**
 * Convert a string from dash-case / kebab-case to PascalCase (or CamelCase,
 * or whatever you call it!)
 *
 * @param str a string to convert
 * @returns a converted string
 */
export const dashToPascalCase = (str: string): string =>
  str
    .toLowerCase()
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

/**
 * Convert a string to 'camelCase'
 *
 * @param str the string to convert
 * @returns the converted string
 */
export const toCamelCase = (str: string) => {
  const pascalCase = dashToPascalCase(str);
  return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
};

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

export const unique = <T>(array: T[], predicate: (item: T) => any = (i) => i): T[] => {
  const set = new Set();
  return array.filter((item) => {
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

const isDefined = (v: any): v is NonNullable<typeof v> => v !== null && v !== undefined;
export const isBoolean = (v: any): v is boolean => typeof v === 'boolean';
export const isFunction = (v: any): v is Function => typeof v === 'function';
export const isNumber = (v: any): v is number => typeof v === 'number';
export const isObject = (val: Object): val is Object =>
  val != null && typeof val === 'object' && Array.isArray(val) === false;
export const isString = (v: any): v is string => typeof v === 'string';
export const isIterable = <T>(v: any): v is Iterable<T> => isDefined(v) && isFunction(v[Symbol.iterator]);
export const isPromise = <T = any>(v: any): v is Promise<T> =>
  !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
