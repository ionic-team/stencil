import { attributeChangedCallback } from '../element/attribute-changed';
import { ComponentController, ConfigApi, IonicUtils, LoadComponents, PlatformApi, Renderer } from '../util/interfaces';
import { connectedCallback } from '../element/connected';
import { disconnectedCallback } from '../element/disconnected';
import { initComponentMeta } from '../element/proxy';
import { theme } from '../element/host';


export function registerComponents(renderer: Renderer, plt: PlatformApi, config: ConfigApi, components: LoadComponents) {
  const cmpControllers = new WeakMap<HTMLElement, ComponentController>();

  const utils: IonicUtils = {
    theme: theme
  };

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = initComponentMeta(tag, components[tag]);

    plt.registerComponent(cmpMeta);

    // closure doesn't support outputting es6 classes (yet)
    // build step does some closure tricks by changing this class
    // to just a function for compiling, then changing it back to a class
    class ProxyElement extends HTMLElement {}

    (<any>ProxyElement).prototype.connectedCallback = function() {
      var ctrl: ComponentController = {};
      cmpControllers.set(this, ctrl);
      connectedCallback(utils, plt, config, renderer, this, ctrl, cmpMeta);
    };

    (<any>ProxyElement).prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string) {
      attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
    };

    (<any>ProxyElement).prototype.disconnectedCallback = function() {
      disconnectedCallback(cmpControllers.get(this));
      cmpControllers.delete(this);
    };

    (<any>ProxyElement).observedAttributes = cmpMeta.observedAttrs;

    window.customElements.define(tag, ProxyElement);
  });

}
