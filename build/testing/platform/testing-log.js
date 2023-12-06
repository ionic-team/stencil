import { caughtErrors } from './testing-constants';
let customError;
const defaultConsoleError = (e) => {
    caughtErrors.push(e);
};
export const consoleError = (e, el) => (customError || defaultConsoleError)(e, el);
export const consoleDevError = (...e) => {
    caughtErrors.push(new Error(e.join(', ')));
};
export const consoleDevWarn = (...args) => {
    // log warnings so we can spy on them when testing
    const params = args.filter((a) => typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean');
    console.warn(...params);
};
export const consoleDevInfo = (..._) => {
    /* noop for testing */
};
export const setErrorHandler = (handler) => (customError = handler);
//# sourceMappingURL=testing-log.js.map