import { AppGlobal, CoreContext } from '../util/interfaces';
import { Build } from '../util/build-conditionals';
import { createPlatformClient } from './platform-client';
import { createPlatformClientLegacy } from './platform-client-legacy';


declare const appNamespace: string;
declare const Context: CoreContext;
declare const hydratedCssClass: string;
declare const publicPath: string;


const App: AppGlobal = (<any>window)[appNamespace] = (<any>window)[appNamespace] || {};


if (Build.es5) {
  const plt = createPlatformClientLegacy(Context, App, window, document, publicPath, hydratedCssClass);

  plt.registerComponents(App.components).forEach(cmpMeta => {
    // es5 way of extending HTMLElement
    function HostElement(self: any) {
      return HTMLElement.call(this, self);
    }

    HostElement.prototype = Object.create(
      HTMLElement.prototype,
      { constructor: { value: HostElement, configurable: true } }
    );

    plt.defineComponent(cmpMeta, HostElement);
  });

} else {
  const plt = createPlatformClient(Context, App, window, document, publicPath, hydratedCssClass);

  // es6 class extends HTMLElement
  plt.registerComponents(App.components).forEach(cmpMeta =>
    plt.defineComponent(cmpMeta, class extends HTMLElement {}));
}
