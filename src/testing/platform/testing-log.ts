import type * as d from '../../declarations';
import { caughtErrors } from './testing-constants';

let customError: d.ErrorHandler;

const defaultConsoleError = (e: any) => {
  console.log('here', customError);
  caughtErrors.push(e);
};

export const consoleError: d.ErrorHandler = (e: any, el?: any) => (customError || defaultConsoleError)(e, el);

export const consoleDevError = (...e: any[]) => {
  caughtErrors.push(new Error(e.join(', ')));
};

export const consoleDevWarn = (..._: any[]) => {
  /* noop for testing */
};

export const consoleDevInfo = (..._: any[]) => {
  /* noop for testing */
};

export const setErrorHandler = (handler: d.ErrorHandler) => customError = handler;
