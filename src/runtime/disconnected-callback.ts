import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, getHostRef } from '@platform';


export const disconnectedCallback = (elm: d.HostElement) => {
  const hostRef = getHostRef(elm);
  if (BUILD.hostListener) {
    if (hostRef.rmListeners) {
      hostRef.rmListeners();
      hostRef.rmListeners = undefined;
    }
  }
  if (BUILD.cmpDidUnload) {
    const instance: any = BUILD.lazyLoad ? hostRef.lazyInstance : elm;
    if (instance && instance.componentDidUnload) {
      try {
        instance.componentDidUnload();
      } catch (e) {
        consoleError(e);
      }
    }
  }
};
