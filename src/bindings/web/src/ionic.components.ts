import { ComponentInstance, ComponentMeta, ProxyComponent } from '../../../utils/interfaces';
import { attributeChangedCallback } from '../../../element/attribute-changed';
import { connectedCallback } from '../../../element/connected';
import { disconnectedCallback } from '../../../element/disconnected';
import { Config } from '../../../utils/config';
import { PlatformApi } from '../../../platform/platform-api';
import { PlatformClient } from '../../../platform/platform-client';

// declared in the base iife arguments
declare const components: ComponentMeta[];


const config = new Config();

const plt = new PlatformClient(window, document);


class ProxyElement extends HTMLElement implements ProxyComponent {
  $instance: ComponentInstance;
  $queued: boolean;

  constructor(public $tag: string) {
    super();
  }

  connectedCallback() {
    const self = this;
    plt.loadComponentModule(self.$tag, (cmpMeta, cmpModule) => {
      connectedCallback(plt, config, self, self.$tag, cmpMeta, cmpModule);
    });
  }

  attributeChangedCallback(attrName: string, oldVal: string, newVal: string, namespace: string) {
    attributeChangedCallback(this.$instance, attrName, oldVal, newVal, namespace);
  }

  disconnectedCallback() {
    disconnectedCallback(this.$instance);
    this.$instance = null;
  }

}


components.forEach(cmpMeta => {
  plt.registerComponent(cmpMeta);

  const tag = cmpMeta.tag;
  const obsAttrs = cmpMeta.obsAttrs && cmpMeta.obsAttrs.slice();

  window.customElements.define(tag, class extends ProxyElement {
    constructor() {
      super(tag);
    }

    static get observedAttributes() {
      return obsAttrs;
    }
  });
});
