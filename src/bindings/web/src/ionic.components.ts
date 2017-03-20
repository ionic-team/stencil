import { ComponentInstance, ComponentMeta, ProxyElement } from '../../../utils/interfaces';
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


components.forEach(meta => {
  plt.registerComponent(meta);

  const tag = meta.tag;
  const obsAttrs = meta.obsAttrs && meta.obsAttrs.slice();


  window.customElements.define(tag, class extends HTMLElement {

    constructor() {
      super();
    }

    connectedCallback() {
      const prxElm: ProxyElement = this;
      plt.loadComponentModule(tag, (cmpMeta, cmpModule) => {
        connectedCallback(plt, config, prxElm, cmpMeta, cmpModule);
      });
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string, namespace: string) {
      const prxElm: ProxyElement = this;
      attributeChangedCallback(prxElm.$instance, attrName, oldVal, newVal, namespace);
    }

    disconnectedCallback() {
      const prxElm: ProxyElement = this;
      disconnectedCallback(prxElm);
    }

    static get observedAttributes() {
      return obsAttrs;
    }
  });
});
