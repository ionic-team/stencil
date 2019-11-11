import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef, plt } from '@platform';
import { PLATFORM_FLAGS } from './runtime-constants';
import { safeCall } from './update-component';


export const disconnectedCallback = (elm: d.HostElement) => {
  if ((plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0) {
    const hostRef = getHostRef(elm);
    const instance: any = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;

    if (BUILD.hostListener) {
      if (hostRef.$rmListeners$) {
        hostRef.$rmListeners$();
        hostRef.$rmListeners$ = undefined;
      }
    }

    // clear CSS var-shim tracking
    if (BUILD.cssVarShim && plt.$cssShim$) {
      plt.$cssShim$.removeHost(elm);
    }

    if (BUILD.lazyLoad && BUILD.disconnectedCallback) {
      safeCall(instance, 'disconnectedCallback');
    }
    if (BUILD.cmpDidUnload) {
      safeCall(instance, 'componentDidUnload');
    }
  }
};
