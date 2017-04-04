import { attributeChangedCallback } from '../element/attribute-changed';
import { ComponentController, Config, Renderer } from '../utils/interfaces';
import { connectedCallback } from '../element/connected';
import { disconnectedCallback } from '../element/disconnected';
import { initComponentMeta } from '../element/proxy';
import { PlatformApi } from '../platform/platform-api';


export function registerComponentsES5(plt: PlatformApi, config: Config, renderer: Renderer, components: any[]) {
  const ctrls = new WeakMap<HTMLElement, ComponentController>();

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
            ctrls.set(this, ctrl);
            connectedCallback(plt, config, renderer, this, ctrl, cmpMeta);
          }
        },

        attributeChangedCallback: { configurable: true, value:
          function(attrName: string, oldVal: string, newVal: string) {
            var ctrl = ctrls.get(this);
            if (ctrl) {
              attributeChangedCallback(ctrl.instance, cmpMeta, attrName, oldVal, newVal);
            }
          }
        },

        disconnectedCallback: { configurable: true, value:
          function() {
            disconnectedCallback(ctrls.get(this));
            ctrls.delete(this);
          }
        }
      }
    );

    (<any>ProxyElement).observedAttributes = cmpMeta.observedAttrs;

    window.customElements.define(tag, ProxyElement);
  });
}
