import * as dec from '../declarations';
import { createPlatformMainLegacy } from './platform-main-legacy';
import { CustomStyle, supportsCssVars } from './polyfills/css-shim/custom-style';


declare const w: Window;
declare const d: Document;
declare const n: string;
declare const x: dec.CoreContext;
declare const r: string;
declare const h: string;
declare const c: dec.ComponentHostData[];


// es5 build which does not use es module imports or dynamic imports
// and requires the es5 way of extending HTMLElement

let customStyle: CustomStyle;
if (_BUILD_.cssVarShim) {
  let needShim = !supportsCssVars(window);
  if (_BUILD_.isDev) {
    if (window.location.search.indexOf('cssvars=false') > 0) {
      // by adding ?shadow=false it'll force the slot polyfill
      // only add this check when in dev mode
      needShim = true;
    }
  }
  if (needShim) {
    customStyle = new CustomStyle(w, d);
  }
}

createPlatformMainLegacy(n, x, w, d, r, h, c, customStyle);
