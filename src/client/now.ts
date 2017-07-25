import { Now } from '../util/interfaces';


export function getNowFunction(window: any): Now {
  // performance.now() polyfill
  // required for client-side only
  const perf = window.performance = window.performance || {};

  if (!perf.now) {
    const appStart = Date.now();
    perf.now = () => {
      return Date.now() - appStart;
    };
  }

  return function now() {
    return perf.now();
  };
}
