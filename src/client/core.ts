import { AppGlobal } from '../util/interfaces';
import { Build } from '../util/build-conditionals';
import { createPlatformClient } from './platform-client';


const App: AppGlobal = (<any>window)[appNamespace] = (<any>window)[appNamespace] || {};

const plt = createPlatformClient(Context, App, window, document, publicPath, hydratedCssClass);


if (Build.es5) {
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
  // es6 class extends HTMLElement
  plt.registerComponents(App.components).forEach(cmpMeta =>
    plt.defineComponent(cmpMeta, class extends HTMLElement {}));
}
