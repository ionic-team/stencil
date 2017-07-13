import { createConfigController } from '../../util/config-controller';
import { createDomApi } from '../../core/renderer/dom-api';
import { createDomControllerClient } from '../../core/client/dom-client';
import { createPlatformClient } from '../../core/client/platform-client';
import { createQueueClient } from '../../core/client/queue-client';
import { detectPlatforms } from '../../core/platform/platform-util';
import { ProjectNamespace } from '../../util/interfaces';
import { PLATFORM_CONFIGS } from '../../core/platform/platform-configs';


declare const globalNamespace: string;
declare const staticBuildDir: string;

const Gbl: ProjectNamespace = (<any>window)[globalNamespace] = (<any>window)[globalNamespace] || {};

const domCtrl = createDomControllerClient(window);

const plt = createPlatformClient(
  Gbl,
  window,
  createDomApi(document),
  createConfigController(Gbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core')),
  domCtrl,
  createQueueClient(domCtrl),
  staticBuildDir
);

plt.registerComponents(Gbl.components).forEach(cmpMeta => {
  function HostElement(self: any) {
    return HTMLElement.call(this, self);
  }

  HostElement.prototype = Object.create(
    HTMLElement.prototype,
    { constructor: { value: HostElement, configurable: true } }
  );

  plt.defineComponent(cmpMeta, HostElement);
});
