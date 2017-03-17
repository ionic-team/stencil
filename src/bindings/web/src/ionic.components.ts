import { ComponentRegistry, ProxyComponent } from '../../../utils/interfaces';
import { Config } from '../../../utils/config';
import { PlatformClient } from '../../../platform/platform-client';
import { ProxyElement } from '../../../element/proxy-element';


const config = new Config();

const plt = new PlatformClient(window, document);

const components: ComponentRegistry = process.env.COMPONENTS;

plt.registerComponents(components);

Object.keys(components).forEach(tag => {
  const cmpMeta = components[tag];

  window.customElements.define(tag, class extends ProxyElement implements ProxyComponent {
    constructor() {
      super(plt, config, tag);
    }

    static get observedAttributes() {
      return cmpMeta.obsAttrs;
    }
  });
});
