import { attributeChangedCallback } from '../element/attribute-changed';
import { ComponentController, Config, Renderer } from '../utils/interfaces';
import { connectedCallback } from '../element/connected';
import { disconnectedCallback } from '../element/disconnected';
import { initComponentMeta } from '../element/proxy';
import { PlatformApi } from '../platform/platform-api';


export function registerComponents(plt: PlatformApi, config: Config, renderer: Renderer, components: any[]) {
  const ctrls = new WeakMap<HTMLElement, ComponentController>();

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = initComponentMeta(tag, components[tag]);

    plt.registerComponent(cmpMeta);

    // closure doesn't support outputting es6 classes (yet)
    // build step does some closure tricks by changing this class
    // to just a function for compiling, then changing it back to a class
    class ProxyElement extends HTMLElement {}

    (<any>ProxyElement).prototype.connectedCallback = function() {
      var ctrl: ComponentController = {};
      ctrls.set(this, ctrl);
      connectedCallback(plt, config, renderer, this, ctrl, cmpMeta);
    };

    (<any>ProxyElement).prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string) {
      var ctrl = ctrls.get(this);
      if (ctrl) {
        attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal);
      }
    };

    (<any>ProxyElement).prototype.disconnectedCallback = function() {
      disconnectedCallback(ctrls.get(this));
      ctrls.delete(this);
    };

    (<any>ProxyElement).observedAttributes = cmpMeta.observedAttrs;

    window.customElements.define(tag, ProxyElement);
  });

}
