import { ComponentController, ComponentMeta, ProxyElement } from '../../../utils/interfaces';
import { attributeChangedCallback } from '../../../element/attribute-changed';
import { connectedCallback } from '../../../element/connected';
import { disconnectedCallback } from '../../../element/disconnected';
import { Config } from '../../../utils/config';
import { PlatformApi } from '../../../platform/platform-api';
import { PlatformClient } from '../../../platform/platform-client';
import { update } from '../../../element/update';
import { initRenderer, attributesModule, classModule } from '../../../renderer/core';
import { initComponentMeta } from '../../../element/proxy';


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
  initComponentMeta(cmpMeta);

  var tag = cmpMeta.tag;

  plt.registerComponent(cmpMeta);

  function ProxyElementES5() {
    return HTMLElement.apply(this);
  }
  ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
  ProxyElementES5.prototype.constructor = ProxyElementES5;

  ProxyElementES5.prototype.connectedCallback = function() {
    var ctrl: ComponentController = {};
    ctrls.set(this, ctrl);
    connectedCallback(plt, config, renderer, this, ctrl, tag);
  };

  ProxyElementES5.prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string, namespace: string) {
    var ctrl = ctrls.get(this);
    if (ctrl && ctrl.instance) {
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
