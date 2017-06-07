import { ConfigController } from '../../../util/config-controller';
import { createPlatformClient } from '../../../core/client/platform-client';
import { DomClient } from '../../../core/client/dom-client';
import { IonicGlobal } from '../../../util/interfaces';
import { PLATFORM_CONFIGS } from '../../../core/platform/platform-configs';
import { QueueClient } from '../../../core/client/queue-client';
import { detectPlatforms } from '../../../core/platform/platform-util';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGbl.DomCtrl = DomClient(window);

IonicGbl.QueueCtrl = QueueClient(window);

IonicGbl.ConfigCtrl = ConfigController(IonicGbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core'));

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
