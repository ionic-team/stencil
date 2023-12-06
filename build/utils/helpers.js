export const isDef = (v) => v != null;
/**
 * Convert a string from PascalCase to dash-case
 *
 * @param str the string to convert
 * @returns a converted string
 */
export const toDashCase = (str) => str
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
export const dashToPascalCase = (str) => str
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
export const toCamelCase = (str) => {
    const pascalCase = dashToPascalCase(str);
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
};
/**
 * Capitalize the first letter of a string
 *
 * @param str the string to capitalize
 * @returns a capitalized string
 */
export const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * This is just a no-op, don't expect it to do anything.
 */
export const noop = () => {
    /* noop*/
};
/**
 * Check whether a value is a 'complex type', defined here as an object or a
 * function.
 *
 * @param o the value to check
 * @returns whether it's a complex type or not
 */
export const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};
/**
 * Sort an array without mutating it in-place (as `Array.prototype.sort`
 * unfortunately does)
 *
 * @param array the array you'd like to sort
 * @param prop a function for deriving sortable values (strings or numbers)
 * from array members
 * @returns a new array of all items `x` in `array` ordered by `prop(x)`
 */
export const sortBy = (array, prop) => {
    return array.slice().sort((a, b) => {
        const nameA = prop(a);
        const nameB = prop(b);
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });
};
/**
 * A polyfill of sorts for `Array.prototype.flat` which will return the result
 * of calling that method if present and, if not, return an equivalent based on
 * `Array.prototype.reduce`.
 *
 * @param array the array to flatten (one level)
 * @returns a flattened array
 */
export const flatOne = (array) => {
    if (array.flat) {
        return array.flat(1);
    }
    return array.reduce((result, item) => {
        result.push(...item);
        return result;
    }, []);
};
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
export const unique = (array, predicate = (i) => i) => {
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
/**
 * A utility for building an object from an iterable very similar to
 * `Object.fromEntries`
 *
 * @param entries an iterable object holding entries (key-value tuples) to
 * plop into a new object
 * @returns an object containing those entries
 */
export const fromEntries = (entries) => {
    const object = {};
    for (const [key, value] of entries) {
        object[key] = value;
    }
    return object;
};
/**
 * Based on a given object, create a new object which has only the specified
 * key-value pairs included in it.
 *
 * @param obj the object from which to take values
 * @param keys a set of keys to take
 * @returns an object mapping `key` to `obj[key]` if `obj[key]` is truthy for
 * every `key` in `keys`
 */
export const pluck = (obj, keys) => {
    return keys.reduce((final, key) => {
        if (obj[key]) {
            final[key] = obj[key];
        }
        return final;
    }, {});
};
const isDefined = (v) => v !== null && v !== undefined;
export const isBoolean = (v) => typeof v === 'boolean';
export const isFunction = (v) => typeof v === 'function';
export const isNumber = (v) => typeof v === 'number';
export const isObject = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false;
export const isString = (v) => typeof v === 'string';
export const isIterable = (v) => isDefined(v) && isFunction(v[Symbol.iterator]);
export const isPromise = (v) => !!v && (typeof v === 'object' || typeof v === 'function') && typeof v.then === 'function';
//# sourceMappingURL=helpers.js.map