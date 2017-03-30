import { ComponentController, ComponentInstance, Ionic, ProxyElement } from '../../../utils/interfaces';
import { attributeChangedCallback } from '../../../element/attribute-changed';
import { update } from '../../../element/update';
import { connectedCallback } from '../../../element/connected';
import { disconnectedCallback } from '../../../element/disconnected';
import { Config } from '../../../utils/config';
import { PlatformApi } from '../../../platform/platform-api';
import { PlatformClient } from '../../../platform/platform-client';
import { initRenderer } from '../../../renderer/core';
import { initComponentMeta } from '../../../element/proxy';


// declared in the base iife arguments
declare const ionic: Ionic;


const plt = new PlatformClient(window, document, ionic);
const config = ionic.config || new Config();
const renderer = initRenderer(plt);

const ctrls = new WeakMap<HTMLElement, ComponentController>();


Object.keys(ionic.components || {}).forEach(tag => {
  const cmpMeta = initComponentMeta(tag, ionic.components[tag]);

  plt.registerComponent(cmpMeta);

  window.customElements.define(tag, class extends HTMLElement {

    connectedCallback() {
      const ctrl: ComponentController = {};
      ctrls.set(this, ctrl);
      connectedCallback(plt, config, renderer, this, ctrl, cmpMeta);
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string, namespace: string) {
      const ctrl = ctrls.get(this);
      if (ctrl) {
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
