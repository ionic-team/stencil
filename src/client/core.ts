import { createDomApi } from '../core/renderer/dom-api';
import { createDomControllerClient } from './dom-client';
import { createPlatformClient } from './platform-client';
import { createQueueClient } from './queue-client';
import { ProjectGlobal } from '../util/interfaces';


declare const projectNamespace: string;
declare const publicPath: string;

const Gbl: ProjectGlobal = (<any>window)[projectNamespace] = (<any>window)[projectNamespace] || {};

const domCtrl = createDomControllerClient(window);

const plt = createPlatformClient(
  Gbl,
  window,
  createDomApi(document),
  domCtrl,
  createQueueClient(domCtrl),
  publicPath
);

plt.registerComponents(Gbl.components).forEach(cmpMeta => {
  plt.defineComponent(cmpMeta, class HostElement extends HTMLElement {});
});
