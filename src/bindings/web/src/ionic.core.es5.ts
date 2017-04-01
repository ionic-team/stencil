import { attributeChangedCallback } from '../../../element/attribute-changed';
import { ComponentController, Ionic } from '../../../utils/interfaces';
import { connectedCallback } from '../../../element/connected';
import { disconnectedCallback } from '../../../element/disconnected';
import { initComponentMeta } from '../../../element/proxy';
import { initRenderer } from '../../../renderer/core';
import { PlatformClient } from '../../../platform/platform-client';
import { update } from '../../../element/update';


const ionic: Ionic = window['Ionic'] = window['Ionic'] || {};

const plt = PlatformClient(window, document, ionic);
const renderer = initRenderer(plt);

const ctrls = new WeakMap<HTMLElement, ComponentController>();


Object.keys(ionic.components || {}).forEach(tag => {
  const cmpMeta = initComponentMeta(tag, ionic.components[tag]);

  plt.registerComponent(cmpMeta);

  function ProxyElementES5() {
    return HTMLElement.apply(this);
  }
  ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
  ProxyElementES5.prototype.constructor = ProxyElementES5;

  ProxyElementES5.prototype.connectedCallback = function() {
    var ctrl: ComponentController = {};
    ctrls.set(this, ctrl);
    connectedCallback(plt, ionic.config, renderer, this, ctrl, cmpMeta);
  };

  ProxyElementES5.prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string, namespace: string) {
    var ctrl = ctrls.get(this);
    if (ctrl) {
      attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal, namespace);
    }
  };

  ProxyElementES5.prototype.disconnectedCallback = function() {
    disconnectedCallback(ctrls.get(this));
    ctrls.delete(this);
  };

  (<any>ProxyElementES5).observedAttributes = cmpMeta.observedAttributes;

  window.customElements.define(tag, ProxyElementES5);
});
