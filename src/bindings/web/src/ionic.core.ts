import { ConfigController } from '../../../util/config-controller';
import { createPlatformClient } from '../../../core/client/platform-client';
import { detectPlatforms } from '../../../core/platform/platform-util';
import { DomClient } from '../../../core/client/dom-client';
import { IonicGlobal } from '../../../util/interfaces';
import { PLATFORM_CONFIGS } from '../../../core/platform/platform-configs';
import { QueueClient } from '../../../core/client/queue-client';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGbl.DomCtrl = DomClient(window);

IonicGbl.QueueCtrl = QueueClient(window);

IonicGbl.ConfigCtrl = ConfigController(IonicGbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core'));

const plt = createPlatformClient(window, window.document, IonicGbl, IonicGbl.QueueCtrl);

plt.registerComponents(IonicGbl.components).forEach(cmpMeta => {
  plt.defineComponent(cmpMeta, class HostElement extends HTMLElement {});
});
