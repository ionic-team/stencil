import * as d from '../declarations';
import { createPlatformMainLegacy } from './platform-main-legacy';
import { CustomStyle, supportsCssVars } from './polyfills/css-shim/custom-style';


declare const namespace: string;
declare const Context: d.CoreContext;
declare const resourcesUrl: string;
declare const hydratedCssClass: string;
declare const components: d.ComponentHostData[];


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
    customStyle = new CustomStyle(window, document);
  }
}

createPlatformMainLegacy(namespace, Context, window, document, resourcesUrl, hydratedCssClass, components, customStyle);
