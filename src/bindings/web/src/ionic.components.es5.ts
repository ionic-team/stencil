import { ComponentMeta, ProxyElement } from '../../../utils/interfaces';
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


components.forEach(function(meta) {
  plt.registerComponent(meta);

  var tag = meta.tag;
  var obsAttrs = meta.obsAttrs && meta.obsAttrs.slice();


  function ProxyElementES5() {
    return HTMLElement.apply(this);
  }
  ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
  ProxyElementES5.prototype.constructor = ProxyElementES5;

  ProxyElementES5.prototype.connectedCallback = function() {
    var prxElm: ProxyElement = this;
    plt.loadComponentModule(tag, function(cmpMeta, cmpModule) {
      connectedCallback(plt, config, prxElm, cmpMeta, cmpModule);
    });
  };

  ProxyElementES5.prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string, namespace: string) {
    var prxElm: ProxyElement = this;
    attributeChangedCallback(prxElm.$instance, attrName, oldVal, newVal, namespace);
  };

  ProxyElementES5.prototype.disconnectedCallback = function() {
    var prxElm: ProxyElement = this;
    disconnectedCallback(prxElm);
  };

  (<any>ProxyElementES5).observedAttributes = obsAttrs;

  window.customElements.define(tag, ProxyElementES5);
});
