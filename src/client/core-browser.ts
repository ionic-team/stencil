import * as d from '../declarations';
import { createPlatformMain } from './platform-main';
import { createPlatformMainLegacy } from './platform-main-legacy';
import { CustomStyle, supportsCssVars } from './polyfills/css-shim/custom-style';


declare const namespace: string;
declare const Context: d.CoreContext;
declare const resourcesUrl: string;
declare const hydratedCssClass: string;


if (__BUILD_CONDITIONALS__.polyfills) {
  // es5 build which does not use es module imports or dynamic imports
  // and requires the es5 way of extending HTMLElement

  let customStyle: CustomStyle;
  if (__BUILD_CONDITIONALS__.cssVarShim) {
    let needShim = !supportsCssVars(window);
    if (__BUILD_CONDITIONALS__.isDev) {
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

  createPlatformMainLegacy(namespace, Context, window, document, resourcesUrl, hydratedCssClass, customStyle);

} else {
  // esm build which uses es module imports and dynamic imports
  createPlatformMain(namespace, Context, window, document, resourcesUrl, hydratedCssClass);
}
