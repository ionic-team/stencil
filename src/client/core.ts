import { Build } from '../util/build-conditionals';
import { CoreContext } from '../declarations';
import { createPlatformMain } from './platform-main';
import { createPlatformMainLegacy } from './platform-main-legacy';


declare const namespace: string;
declare const Context: CoreContext;
declare const resourcesUrl: string;
declare const hydratedCssClass: string;


if (Build.es5) {
  // es5 build which does not use es module imports or dynamic imports
  // and requires the es5 way of extending HTMLElement
  createPlatformMainLegacy(namespace, Context, window, document, resourcesUrl, hydratedCssClass);

} else {
  // esm build which uses es module imports and dynamic imports
  createPlatformMain(namespace, Context, window, document, resourcesUrl, hydratedCssClass);
}
