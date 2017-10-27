import { AppGlobal } from '../util/interfaces';
import { createPlatformClient } from './platform-client';
import { _build_es2015, _build_es5 } from '../util/build-conditionals';


const App: AppGlobal = (<any>window)[appNamespace] = (<any>window)[appNamespace] || {};

const plt = createPlatformClient(Context, App, window, document, publicPath, hydratedCssClass);

plt.registerComponents(App.components).forEach(cmpMeta => {

  if (_build_es2015) {
    // es6 class extends HTMLElement
    plt.defineComponent(cmpMeta, class HostElement extends HTMLElement {});

  } else if (_build_es5) {
    // es5 way of extending HTMLElement
    function HostElement(self: any) {
      return HTMLElement.call(this, self);
    }

    HostElement.prototype = Object.create(
      HTMLElement.prototype,
      { constructor: { value: HostElement, configurable: true } }
    );

    plt.defineComponent(cmpMeta, HostElement);
  }

});
