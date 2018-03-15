import { Build } from '../util/build-conditionals';
import { CoreContext } from '../declarations';
import { createPlatformClient } from './platform-client';
import { createPlatformClientLegacy } from './platform-client-legacy';


declare const namespace: string;
declare const Context: CoreContext;
declare const resourcesUrl: string;
declare const hydratedCssClass: string;


if (Build.es5) {
  // es5 build which does not use es module imports or dynamic imports
  // and requires the es5 way of extending HTMLElement
  createPlatformClientLegacy(namespace, Context, window, document, resourcesUrl, hydratedCssClass);

} else {
  // es2015 build which does uses es module imports and dynamic imports
  createPlatformClient(namespace, Context, window, document, resourcesUrl, hydratedCssClass);
}
