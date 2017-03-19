import { ComponentMeta, ProxyComponent } from '../../../utils/interfaces';
import { Config } from '../../../utils/config';
import { PlatformClient } from '../../../platform/platform-client';
import { ProxyElement } from '../../../element/proxy-element';


const config = new Config();

const plt = new PlatformClient(window, document);

declare const IONIC_COMPONENTS: ComponentMeta[];

const components = IONIC_COMPONENTS;

components.forEach(cmpMeta => {
  plt.registerComponent(cmpMeta);

  window.customElements.define(cmpMeta.tag, class extends ProxyElement implements ProxyComponent {
    constructor() {
      super(plt, config, cmpMeta.tag);
    }

    static get observedAttributes() {
      return cmpMeta.obsAttrs;
    }
  });
});
