import { attributeChangedCallback } from './attribute-changed';
import { ConfigApi, LoadComponents, PlatformApi, RendererApi } from '../util/interfaces';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { queueUpdate } from './update';


export function registerComponentsES5(window: Window, renderer: RendererApi, plt: PlatformApi, config: ConfigApi, components: LoadComponents) {

  Object.keys(components || {}).forEach(tag => {
    const cmpMeta = plt.registerComponent(tag, components[tag]);


    function ProxyElement(self: any) {
      return HTMLElement.call(this, self);
    }

    ProxyElement.prototype = Object.create(
      HTMLElement.prototype,
      {
        constructor: { value: ProxyElement, configurable: true },

        connectedCallback: { configurable: true, value:
          function() {
            connectedCallback(plt, config, renderer, this, cmpMeta);
          }
        },

        attributeChangedCallback: { configurable: true, value:
          function(attrName: string, oldVal: string, newVal: string) {
            attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
          }
        },

        disconnectedCallback: { configurable: true, value:
          function() {
            disconnectedCallback(this);
          }
        },

        $queueUpdate: { configurable: true, value:
          function(priority?: number) {
            queueUpdate(plt, config, renderer, this, tag, priority);
          }
        }

      }
    );

    (<any>ProxyElement).observedAttributes = cmpMeta.obsAttrs;

    window.customElements.define(tag, ProxyElement);
  });
}
