/**
 * Create an `Ok` given a value. This doesn't do any checking that the value is
 * 'ok-ish' since doing so would make an undue assumption about what is 'ok'.
 * Instead, this trusts the user to determine, at the call site, whether
 * something is `ok()` or `err()`.
 *
 * @param value the value to wrap up in an `Ok`
 * @returns an Ok wrapping the value
 */
export const ok = (value) => ({
    isOk: true,
    isErr: false,
    value,
});
/**
 * Create an `Err` given a value.
 *
 * @param value the value to wrap up in an `Err`
 * @returns an Ok wrapping the value
 */
export const err = (value) => ({
    isOk: false,
    isErr: true,
    value,
});
export function map(result, fn) {
    if (result.isOk) {
        const val = fn(result.value);
        if (val instanceof Promise) {
            return val.then((newVal) => ok(newVal));
        }
        else {
            return ok(val);
        }
    }
    if (result.isErr) {
        // unwrapping the error is necessary here for typechecking
        // but you and I both know its type hasn't changed a bit!
        const value = result.value;
        return err(value);
    }
    throw 'should never get here';
}
/**
 * Unwrap a {@link Result}, return the value inside if it is an `Ok` and
 * throw with the wrapped value if it is an `Err`.
 *
 * @throws with the wrapped value if it is an `Err`.
 * @param result a result to peer inside of
 * @returns the wrapped value, if `Ok`
 */
export const unwrap = (result) => {
    if (result.isOk) {
        return result.value;
    }
    else {
        throw result.value;
    }
};
/**
 * Unwrap a {@link Result}, return the value inside if it is an `Err` and
 * throw with the wrapped value if it is an `Ok`.
 *
 * @throws with the wrapped value if it is an `Ok`.
 * @param result a result to peer inside of
 * @returns the wrapped value, if `Err`
 */
export const unwrapErr = (result) => {
    if (result.isErr) {
        return result.value;
    }
    else {
        throw result.value;
    }
};
//# sourceMappingURL=result.js.map