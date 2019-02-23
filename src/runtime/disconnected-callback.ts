import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, getHostRef } from '@platform';


export const disconnectedCallback = (elm: d.HostElement) => {
  if (BUILD.cmpDidUnload) {
    const instance: any = BUILD.lazyLoad ? getHostRef(elm).lazyInstance : elm;
    if (instance && instance.componentDidUnload) {
      try {
        instance.componentDidUnload();
      } catch (e) {
        consoleError(e);
      }
    }
  }
};
