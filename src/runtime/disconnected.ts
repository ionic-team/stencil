import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { activelyProcessingCmps } from '@platform';


export const disconnectedCallback = (elm: d.HostElement) => {
  if (BUILD.exposeAppOnReady) {
    activelyProcessingCmps.delete(elm);
  }
};
