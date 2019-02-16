import * as d from '@declarations';
import { HOST_STATE } from '@utils';

export const componentOnReady = (hostRef: d.HostRef) => {
  if (!hostRef.onReadyPromise) {
    hostRef.onReadyPromise = hostRef.stateFlags & HOST_STATE.hasRendered ? Promise.resolve(hostRef.hostElement) : new Promise(resolve => hostRef.onReadyResolve = resolve);
  }
  return hostRef.onReadyPromise;
};
