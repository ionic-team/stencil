import { attributeChangedCallback } from './attribute-changed';
import { ConfigApi, LoadComponents, PlatformApi, RendererApi } from '../util/interfaces';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';


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

        whenReady: { configurable: true, value:
          function(cb: Function) {
            if (this.$instance) {
              cb();
            } else if (this.$readyFns) {
              this.$readyFns.push(cb);
            } else {
              this.$readyFns = [cb];
            }
          }
        }

      }
    );

    (<any>ProxyElement).observedAttributes = cmpMeta.obsAttrs;

    window.customElements.define(tag, ProxyElement);
  });
}
