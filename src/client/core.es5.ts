import { AppGlobal } from '../util/interfaces';
import { createPlatformClient } from './platform-client';


const App: AppGlobal = (<any>window)[appNamespace] = (<any>window)[appNamespace] || {};

const plt = createPlatformClient(Core, App, window, document, publicPath);

plt.registerComponents(App.components).forEach(cmpMeta => {
  // note that we're extending HTMLElement the raw ES5 way
  // this is why there are two core files, and the browser
  // figures out which one it should use on-demand
  function HostElement(self: any) {
    return HTMLElement.call(this, self);
  }

  HostElement.prototype = Object.create(
    HTMLElement.prototype,
    { constructor: { value: HostElement, configurable: true } }
  );

  plt.defineComponent(cmpMeta, HostElement);
});
