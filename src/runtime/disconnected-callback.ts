import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, getHostRef } from '@platform';


export const disconnectedCallback = (elm: d.HostElement) => {
  const hostRef = getHostRef(elm);
  if (BUILD.hostListener) {
    if (hostRef.$rmListeners$) {
      hostRef.$rmListeners$();
      hostRef.$rmListeners$ = undefined;
    }
  }
  const instance: any = (BUILD.lazyLoad || BUILD.hydrateServerSide) ? hostRef.$lazyInstance$ : elm;
  if ((BUILD.lazyLoad || BUILD.hydrateServerSide) && BUILD.disconnectedCallback && instance && instance.disconnectedCallback) {
    try {
      instance.disconnectedCallback();
    } catch (e) {
      consoleError(e);
    }
  }
  if (BUILD.cmpDidUnload && instance && instance.componentDidUnload) {
    try {
      instance.componentDidUnload();
    } catch (e) {
      consoleError(e);
    }
  }
};
