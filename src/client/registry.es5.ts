import { attributeChangedCallback } from './attribute-changed';
import { ComponentController, ConfigApi, LoadComponents, PlatformApi, RendererApi } from '../util/interfaces';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';


export function registerComponentsES5(renderer: RendererApi, plt: PlatformApi, config: ConfigApi, components: LoadComponents) {
  const cmpControllers = new WeakMap<HTMLElement, ComponentController>();

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = plt.registerComponent(tag, components[tag]);


    function ProxyElement(self) {
      return HTMLElement.call(this, self);
    }

    ProxyElement.prototype = Object.create(
      HTMLElement.prototype,
      {
        constructor: { value: ProxyElement, configurable: true },

        connectedCallback: { configurable: true, value:
          function() {
            var ctrl: ComponentController = {};
            cmpControllers.set(this, ctrl);
            connectedCallback(plt, config, renderer, this, ctrl, cmpMeta);
          }
        },

        attributeChangedCallback: { configurable: true, value:
          function(attrName: string, oldVal: string, newVal: string) {
            attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
          }
        },

        disconnectedCallback: { configurable: true, value:
          function() {
            disconnectedCallback(cmpControllers.get(this));
            cmpControllers.delete(this);
          }
        }
      }
    );

    (<any>ProxyElement).observedAttributes = cmpMeta.observedAttrs;

    window.customElements.define(tag, ProxyElement);
  });
}
