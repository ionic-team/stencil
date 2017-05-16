import { attributeChangedCallback } from './attribute-changed';
import { ConfigApi, LoadComponents, PlatformApi, ProxyElement, RendererApi } from '../util/interfaces';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { initLoadComponent, queueUpdate } from './update';


export function registerComponents(renderer: RendererApi, plt: PlatformApi, config: ConfigApi, components: LoadComponents) {

  plt.registerComponents(components).forEach(cmpMeta => {
    // closure doesn't support outputting es6 classes (yet)
    // build step does some closure tricks by changing this class
    // to just a function for compiling, then changing it back to a class
    class ProxyHTMLElement extends HTMLElement {}

    (<any>ProxyHTMLElement).prototype.connectedCallback = function() {
      connectedCallback(plt, config, renderer, this, cmpMeta);
    };

    (<any>ProxyHTMLElement).prototype.attributeChangedCallback = function(attrName: string, oldVal: string, newVal: string) {
      attributeChangedCallback(this, cmpMeta, attrName, oldVal, newVal);
    };

    (<any>ProxyHTMLElement).prototype.disconnectedCallback = function() {
      disconnectedCallback(plt, this);
    };

    (<any>ProxyHTMLElement).prototype.$queueUpdate = function() {
      queueUpdate(plt, config, renderer, this, cmpMeta.tag);
    };

    (<any>ProxyHTMLElement).prototype.$initLoadComponent = function() {
      initLoadComponent(plt, cmpMeta.listeners, this, (<ProxyElement>this).$instance);
    };

    (<any>ProxyHTMLElement).observedAttributes = cmpMeta.obsAttrs;

    plt.defineComponent(cmpMeta.tag, ProxyHTMLElement);
  });

}
