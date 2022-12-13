import { BUILD } from '@app-data';
import { CSS, plt, promiseResolve, win } from '@platform';

export const patchEsm = () => {
  // NOTE!! This fn cannot use async/await!
  // TODO(STENCIL-659): Remove code implementing the CSS variable shim
  // @ts-ignore
  if (BUILD.cssVarShim && !(CSS && CSS.supports && CSS.supports('color', 'var(--c)'))) {
    // @ts-ignore
    return import(/* webpackChunkName: "polyfills-css-shim" */ './polyfills/css-shim.js').then(() => {
      if ((plt.$cssShim$ = (win as any).__cssshim)) {
        // TODO(STENCIL-659): Remove code implementing the CSS variable shim
        return plt.$cssShim$.i();
      } else {
        // for better minification
        return 0;
      }
    });
  }
  return promiseResolve();
};
