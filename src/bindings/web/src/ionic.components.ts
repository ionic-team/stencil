import { ComponentRegistry, ProxyComponent } from '../../../utils/interfaces';
import { Config } from '../../../utils/config';
import { PlatformClient } from '../../../platform/platform-client';
import { ProxyElement } from '../../../element/proxy-element';


const config = new Config();

const plt = new PlatformClient(window, document);


const components: ComponentRegistry = {
  'ion-badge': {
    'hostCss': 'badge',
    'modeStyleUrls': {
      'ios': [
        'badge.ios.css'
      ],
      'md': [
        'badge.md.css'
      ],
      'wp': [
        'badge.wp.css'
      ]
    }
  }
};


plt.registerComponents(components);


Object.keys(components).forEach(tag => {
  const cmpMeta = components[tag];

  const pryEle = class extends ProxyElement implements ProxyComponent {
    constructor() {
      super(plt, config, tag);
    }

    static get observedAttributes() {
      return cmpMeta.obsAttrs
    }
  }

  window.customElements.define(tag, pryEle);
});
