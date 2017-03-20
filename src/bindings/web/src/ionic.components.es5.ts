import { ComponentMeta, ProxyComponent } from '../../../utils/interfaces';
import { Config } from '../../../utils/config';
import { PlatformClient } from '../../../platform/platform-client';

// declared in the base iife arguments
declare const components: ComponentMeta[];


const config = new Config();

const plt = new PlatformClient(window, document);


components.forEach(cmpMeta => {
  plt.registerComponent(cmpMeta);

  function ProxyElementES5() {
    console.log('ProxyElementES5')
    return HTMLElement.apply(this);
  }
  ProxyElementES5.prototype = Object.create(HTMLElement.prototype);
  ProxyElementES5.prototype.constructor = ProxyElementES5;
  (<any>ProxyElementES5).observedAttributes = cmpMeta.obsAttrs;

  window.customElements.define(cmpMeta.tag, ProxyElementES5);

});
