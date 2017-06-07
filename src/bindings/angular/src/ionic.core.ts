import { createPlatformClient } from '../../../core/client/platform-client';
import { IonicGlobal } from '../../../util/interfaces';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = createPlatformClient(window, window.document, IonicGbl, IonicGbl.ConfigCtrl, IonicGbl.QueueCtrl);

plt.registerComponents(IonicGbl.components).forEach(cmpMeta => {
  plt.defineComponent(cmpMeta, class HostElement extends HTMLElement {});
});
