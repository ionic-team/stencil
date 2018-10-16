import * as d from '../declarations';
import { createPlatformMain } from './platform-main';


declare const namespace: string;
declare const Context: d.CoreContext;
declare const resourcesUrl: string;
declare const hydratedCssClass: string;
declare const components: d.ComponentHostData[];


// esm build which uses es module imports and dynamic imports
createPlatformMain(namespace, Context, window, document, resourcesUrl, hydratedCssClass, components);
