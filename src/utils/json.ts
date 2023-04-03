import { JsonSafe } from '@stencil/core/declarations';

/**
 * A thin wrapper around JSON.stringify which ensures that the value to be
 * stringified is a valid JSON-serializable value, as codified by the
 * {@link JsonSafe} type. If you try to serialize a type which isn't valid
 * you'll get a type error.
 *
 * **NOTE**: This is _only_ a type-level safety guarantee. No runtime check is
 * made at all that the passed value has a serializable runtime type.
 *
 * @param toStringify a value to be serialized
 * @param replacer an optional replacer (same as JSON.stringify)
 * @param space an  optional space to use (same as JSON.stringify)
 * @returns a serialized string
 */
export function safeJSONStringify<T>(
  toStringify: T & JsonSafe<T>,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): string {
  return JSON.stringify(toStringify, replacer, space);
}
