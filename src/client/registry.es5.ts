import { attributeChangedCallback } from '../element/attribute-changed';
import { ComponentController, ConfigApi, IonicUtils, LoadComponents, PlatformApi, RendererApi } from '../util/interfaces';
import { connectedCallback } from '../element/connected';
import { disconnectedCallback } from '../element/disconnected';
import { initComponentMeta } from '../element/proxy';
import { theme } from '../element/host';


export function registerComponentsES5(renderer: RendererApi, plt: PlatformApi, config: ConfigApi, components: LoadComponents) {
  const cmpControllers = new WeakMap<HTMLElement, ComponentController>();

  const utils: IonicUtils = {
    theme: theme
  };

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = initComponentMeta(tag, components[tag]);

    plt.registerComponent(cmpMeta);


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
            connectedCallback(utils, plt, config, renderer, this, ctrl, cmpMeta);
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
