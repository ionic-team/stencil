import { attributeChangedCallback } from './attribute-changed';
import { ConfigApi, LoadComponents, PlatformApi, RendererApi } from '../util/interfaces';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { queueUpdate } from './update';


export function registerComponents(window: any, renderer: RendererApi, plt: PlatformApi, config: ConfigApi, components: LoadComponents) {

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = plt.registerComponent(tag, components[tag]);

    // closure doesn't support outputting es6 classes (yet)
    // build step does some closure tricks by changing this class
    // to just a function for compiling, then changing it back to a class
    class ProxyElement extends HTMLElement {}

    (<any>ProxyElement).prototype.connectedCallback = function() {
      connectedCallback(plt, config, renderer, this, cmpMeta);
    };

    (<any>ProxyElement).prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string) {
      attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
    };

    (<any>ProxyElement).prototype.disconnectedCallback = function() {
      disconnectedCallback(this);
    };

    (<any>ProxyElement).prototype.$queueUpdate = function() {
      queueUpdate(plt, config, renderer, this, tag);
    };

    (<any>ProxyElement).observedAttributes = cmpMeta.obsAttrs;

    window.customElements.define(tag, ProxyElement);
  });

}
