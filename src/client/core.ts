import { Build } from '../util/build-conditionals';
import { CoreContext } from '../declarations';
import { createPlatformClient } from './platform-client';
import { createPlatformClientLegacy } from './platform-client-legacy';


declare const appNamespace: string;
declare const Context: CoreContext;
declare const hydratedCssClass: string;
declare const publicPath: string;


if (Build.es5) {
  // es5 build which does not use es module imports or dynamic imports
  // and requires the es5 way of extending HTMLElement
  createPlatformClientLegacy(Context, appNamespace, window, document, publicPath, hydratedCssClass);

} else {
  // es2015 build which does uses es module imports and dynamic imports
  createPlatformClient(Context, appNamespace, window, document, publicPath, hydratedCssClass);
}
