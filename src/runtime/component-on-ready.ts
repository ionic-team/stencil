import * as d from '@declarations';

export const componentOnReady = (hostRef: d.HostRef) => {
  if (!hostRef.onReadyPromise) {
    hostRef.onReadyPromise = hostRef.hasRendered ? Promise.resolve(hostRef.hostElement) : new Promise(resolve => hostRef.onReadyResolve = resolve);
  }
  return hostRef.onReadyPromise;
};
