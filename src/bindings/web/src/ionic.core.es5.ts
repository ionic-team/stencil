import { createConfigController } from '../../../util/config-controller';
import { createDomApi } from '../../../core/renderer/dom-api';
import { createDomControllerClient } from '../../../core/client/dom-client';
import { createPlatformClient } from '../../../core/client/platform-client';
import { createQueueClient } from '../../../core/client/queue-client';
import { detectPlatforms } from '../../../core/platform/platform-util';
import { GlobalNamespace } from '../../../util/interfaces';
import { PLATFORM_CONFIGS } from '../../../core/platform/platform-configs';


const IonicGbl: GlobalNamespace = (<any>window).Ionic = (<any>window).Ionic || {};

const domCtrl = createDomControllerClient(window);

const plt = createPlatformClient(
  IonicGbl,
  window,
  createDomApi(window.document),
  createConfigController(IonicGbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core')),
  domCtrl,
  createQueueClient(domCtrl),
  IonicGbl.staticDir,
  true
);

plt.registerComponents(IonicGbl.components).forEach(cmpMeta => {
  function HostElement(self: any) {
    return HTMLElement.call(this, self);
  }

  HostElement.prototype = Object.create(
    HTMLElement.prototype,
    { constructor: { value: HostElement, configurable: true } }
  );

  plt.defineComponent(cmpMeta, HostElement);
});
