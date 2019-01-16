import * as d from '../declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { activelyProcessingCmps } from '@stencil/core/platform';


export const disconnectedCallback = (elm: d.HostElement) => {
  if (BUILD.exposeAppOnReady) {
    activelyProcessingCmps.delete(elm);
  }
};
