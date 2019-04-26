import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, cssVarShim, getHostRef, plt } from '@platform';
import { PLATFORM_FLAGS } from './runtime-constants';


export const disconnectedCallback = (elm: d.HostElement) => {
  if ((plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0) {
    const hostRef = getHostRef(elm);

    if (BUILD.hostListener) {
      if (hostRef.$rmListeners$) {
        hostRef.$rmListeners$();
        hostRef.$rmListeners$ = undefined;
      }
    }

    // clear CSS var-shim tracking
    if (cssVarShim) {
      cssVarShim.removeHost(elm);
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
  }
};
