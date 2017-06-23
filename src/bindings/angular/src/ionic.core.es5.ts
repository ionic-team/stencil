import { createDomApi } from '../../../core/renderer/dom-api';
import { createPlatformClient } from '../../../core/client/platform-client';
import { GlobalNamespace } from '../../../util/interfaces';


const IonicGbl: GlobalNamespace = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = createPlatformClient(
  IonicGbl,
  window,
  createDomApi(window.document),
  IonicGbl.ConfigCtrl,
  IonicGbl.DomCtrl,
  IonicGbl.QueueCtrl,
  IonicGbl.staticDir,
  false
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
