export declare const isDef: (v: any) => boolean;
/**
 * Convert a string from PascalCase to dash-case
 *
 * @param str the string to convert
 * @returns a converted string
 */
export declare const toDashCase: (str: string) => string;
/**
 * Convert a string from dash-case / kebab-case to PascalCase (or CamelCase,
 * or whatever you call it!)
 *
 * @param str a string to convert
 * @returns a converted string
 */
export declare const dashToPascalCase: (str: string) => string;
/**
 * Convert a string to 'camelCase'
 *
 * @param str the string to convert
 * @returns the converted string
 */
export declare const toCamelCase: (str: string) => string;
/**
 * Capitalize the first letter of a string
 *
 * @param str the string to capitalize
 * @returns a capitalized string
 */
export declare const toTitleCase: (str: string) => string;
/**
 * This is just a no-op, don't expect it to do anything.
 */
export declare const noop: () => any;
/**
 * Check whether a value is a 'complex type', defined here as an object or a
 * function.
 *
 * @param o the value to check
 * @returns whether it's a complex type or not
 */
export declare const isComplexType: (o: unknown) => boolean;
/**
 * Sort an array without mutating it in-place (as `Array.prototype.sort`
 * unfortunately does)
 *
 * @param array the array you'd like to sort
 * @param prop a function for deriving sortable values (strings or numbers)
 * from array members
 * @returns a new array of all items `x` in `array` ordered by `prop(x)`
 */
export declare const sortBy: <T>(array: T[], prop: (item: T) => string | number) => T[];
/**
 * A polyfill of sorts for `Array.prototype.flat` which will return the result
 * of calling that method if present and, if not, return an equivalent based on
 * `Array.prototype.reduce`.
 *
 * @param array the array to flatten (one level)
 * @returns a flattened array
 */
export declare const flatOne: <T>(array: T[][]) => T[];
/**
 * Deduplicate an array, retaining items at the earliest position in which
 * they appear.
 *
 * So `unique([1,3,2,1,1,4])` would be `[1,3,2,4]`.
 *
 * @param array the array to deduplicate
 * @param predicate an optional function used to generate the key used to
 * determine uniqueness
 * @returns a new, deduplicated array
 */
export declare const unique: <T, K>(array: T[], predicate?: (item: T) => K) => T[];
/**
 * A utility for building an object from an iterable very similar to
 * `Object.fromEntries`
 *
 * @param entries an iterable object holding entries (key-value tuples) to
 * plop into a new object
 * @returns an object containing those entries
 */
export declare const fromEntries: <V>(entries: IterableIterator<[string, V]>) => Record<string, V>;
/**
 * Based on a given object, create a new object which has only the specified
 * key-value pairs included in it.
 *
 * @param obj the object from which to take values
 * @param keys a set of keys to take
 * @returns an object mapping `key` to `obj[key]` if `obj[key]` is truthy for
 * every `key` in `keys`
 */
export declare const pluck: (obj: {
    [key: string]: any;
}, keys: string[]) => {
    [key: string]: any;
};
export declare const isBoolean: (v: any) => v is boolean;
export declare const isFunction: (v: any) => v is Function;
export declare const isNumber: (v: any) => v is number;
export declare const isObject: (val: Object) => val is Object;
export declare const isString: (v: any) => v is string;
export declare const isIterable: <T>(v: any) => v is Iterable<T>;
export declare const isPromise: <T = any>(v: any) => v is Promise<T>;
