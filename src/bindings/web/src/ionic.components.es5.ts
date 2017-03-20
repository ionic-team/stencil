import { ComponentMeta, ProxyComponent, ProxyController } from '../../../utils/interfaces';
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

  var tag = meta.tag;
  var pxyCtrl: ProxyController = {};

  function ProxyElementES5() {
    return HTMLElement.apply(this);
  }
  ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
  ProxyElementES5.prototype.constructor = ProxyElementES5;

  ProxyElementES5.prototype.connectedCallback = function() {
    plt.loadComponentModule(tag, (cmpMeta, cmpModule) => {
      connectedCallback(plt, config, pxyCtrl, tag, cmpMeta, cmpModule);
    });
  };

  ProxyElementES5.prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string, namespace: string) {
    attributeChangedCallback(pxyCtrl.instance, attrName, oldVal, newVal, namespace);
  };

  ProxyElementES5.prototype.disconnectedCallback = function() {
    disconnectedCallback(pxyCtrl.instance);
    pxyCtrl = pxyCtrl.instance = pxyCtrl.root = null;
  };

  (<any>ProxyElementES5).observedAttributes = meta.obsAttrs && meta.obsAttrs.slice();

  window.customElements.define(tag, ProxyElementES5);
});
