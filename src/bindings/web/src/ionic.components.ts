import { ComponentController, ComponentInstance, ComponentMeta, ProxyElement } from '../../../utils/interfaces';
import { attributeChangedCallback } from '../../../element/attribute-changed';
import { update } from '../../../element/update';
import { connectedCallback } from '../../../element/connected';
import { disconnectedCallback } from '../../../element/disconnected';
import { Config } from '../../../utils/config';
import { PlatformApi } from '../../../platform/platform-api';
import { PlatformClient } from '../../../platform/platform-client';
import { initRenderer, attributesModule, classModule } from '../../../renderer/core';

// declared in the base iife arguments
declare const components: ComponentMeta[];


const plt = new PlatformClient(window, document);
const config = new Config();
const renderer = initRenderer([
  attributesModule,
  classModule
], plt);

const ctrls = new WeakMap<HTMLElement, ComponentController>();


components.forEach(function registerComponentMeta(cmpMeta) {
  const tag = cmpMeta.tag;

  plt.registerComponent(cmpMeta);

  window.customElements.define(tag, class extends HTMLElement {

    constructor() {
      super();
    }

    connectedCallback() {
      const ctrl: ComponentController = {};
      ctrls.set(this, ctrl);
      connectedCallback(plt, config, renderer, this, ctrl, tag);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string, namespace: string) {
      const ctrl = ctrls.get(this);
      if (ctrl && ctrl.instance) {
        attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal, namespace);
      }
    }

    disconnectedCallback() {
      disconnectedCallback(ctrls.get(this));
      ctrls.delete(this);
    }

    static get observedAttributes() {
      return cmpMeta.observedAttributes;
    }
  });
});
