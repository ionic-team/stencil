import { caughtErrors } from './testing-constants';

export const consoleError = (e: any) => {
  caughtErrors.push(e);
};

export const consoleDevError = (...e: any[]) => {
  caughtErrors.push(new Error(e.join(', ')));
};

export const consoleDevWarn = (..._: any[]) => {
  /* noop for testing */
};

export const consoleDevInfo = (..._: any[]) => {
  /* noop for testing */
};
