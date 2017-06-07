import { createPlatformClient } from '../../../core/client/platform-client';
import { IonicGlobal } from '../../../util/interfaces';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = createPlatformClient(window, window.document, IonicGbl, IonicGbl.ConfigCtrl, IonicGbl.QueueCtrl);

plt.registerComponents(IonicGbl.components).forEach(cmpMeta => {
  plt.defineComponent(cmpMeta, function(){
    function HostElement(self: any) {
      return HTMLElement.call(this, self);
    }

    HostElement.prototype = Object.create(
      HTMLElement.prototype,
      { constructor: { value: HostElement, configurable: true } }
    );

    return HostElement;
  }());
});
