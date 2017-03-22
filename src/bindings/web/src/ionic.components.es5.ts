import { ComponentController, ComponentMeta, ProxyElement } from '../../../utils/interfaces';
import { attributeChangedCallback } from '../../../element/attribute-changed';
import { disconnectedCallback } from '../../../element/disconnected';
import { Config } from '../../../utils/config';
import { PlatformApi } from '../../../platform/platform-api';
import { PlatformClient } from '../../../platform/platform-client';
import { update } from '../../../element/update';
import { initRenderer, attributesModule, classModule, styleModule } from '../../../renderer/core';

// declared in the base iife arguments
declare const components: ComponentMeta[];


const plt = new PlatformClient(window, document);
const config = new Config();
const renderer = initRenderer([
  attributesModule,
  classModule,
  styleModule
], plt);

const ctrls = new WeakMap<HTMLElement, ComponentController>();


components.forEach(function(meta) {
  plt.registerComponent(meta);

  var tag = meta.tag;
  var obsAttrs = meta.obsAttrs && meta.obsAttrs.slice();


  function ProxyElementES5() {
    var elm = HTMLElement.apply(this);

    ctrls.set(elm, {});

    return elm;
  }
  ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
  ProxyElementES5.prototype.constructor = ProxyElementES5;

  ProxyElementES5.prototype.connectedCallback = function() {
    var elm: ProxyElement = this;
    plt.loadComponentModule(tag, function(cmpMeta, cmpModule) {
      update(plt, config, renderer, elm, ctrls.get(elm), cmpMeta, cmpModule);
    });
  };

  ProxyElementES5.prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string, namespace: string) {
    attributeChangedCallback(ctrls.get(this).instance, attrName, oldVal, newVal, namespace);
  };

  ProxyElementES5.prototype.disconnectedCallback = function() {
    disconnectedCallback(ctrls.get(this));
    ctrls.delete(this);
  };

  (<any>ProxyElementES5).observedAttributes = obsAttrs;

  window.customElements.define(tag, ProxyElementES5);
});
