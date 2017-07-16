import { createConfigController } from '../util/config-controller';
import { createDomApi } from '../core/renderer/dom-api';
import { createDomControllerClient } from './dom-client';
import { createPlatformClient } from './platform-client';
import { createQueueClient } from './queue-client';
import { detectPlatforms } from '../core/platform/platform-util';
import { ProjectGlobal } from '../util/interfaces';
import { PLATFORM_CONFIGS } from '../core/platform/platform-configs';


declare const projectNamespace: string;
declare const publicPath: string;

const Gbl: ProjectGlobal = (<any>window)[projectNamespace] = (<any>window)[projectNamespace] || {};

const domCtrl = createDomControllerClient(window);

const plt = createPlatformClient(
  Gbl,
  window,
  createDomApi(document),
  createConfigController(Gbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core')),
  domCtrl,
  createQueueClient(domCtrl),
  publicPath
);

plt.registerComponents(Gbl.components).forEach(cmpMeta => {
  plt.defineComponent(cmpMeta, class HostElement extends HTMLElement {});
});
