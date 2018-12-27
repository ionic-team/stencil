import * as d from '../declarations';
import { attributeChangedCallback } from './attribute-changed';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { initHostComponent } from './init-host-component';
import { refs } from './data';
import { resolved } from './task-queue';


export const bootstrapLazy = (cmpLazyMetaData: d.ComponentLazyRuntimeMeta[]) => {
  // bootstrapLazy

  cmpLazyMetaData.forEach(cmpMeta => {

    class StencilLayHost extends HTMLElement {
      // StencilLazyHost

      constructor() {
        super();

        const elmData: d.ElementData = {
          elm: this,
          instanceValues: new Map(),
          instance: null
        };

        refs.set(this, elmData);
      }

      connectedCallback() {
        connectedCallback(this);
      }

      disconnectedCallback() {
        if (BUILD.lazyLoad || BUILD.vdomListener || BUILD.listener) {
          disconnectedCallback(this);
        }
      }

      attributeChangedCallback(attrName: string, _oldValue: string, newValue: string) {
        if (BUILD.observeAttr) {
          attributeChangedCallback(this, cmpMeta.attrNameToPropName, attrName, newValue);
        }
      }

      's-init'() {
        if (BUILD.lazyLoad) {
          // initComponentLoaded(plt, this);
        }
      }

      forceUpdate() {
        if (BUILD.updatable) {
          // queueUpdate(plt, this, plt.getElmData(this));
        }
      }

      componentOnReady(): any {
        if (BUILD.lifecycle || BUILD.updatable) {
          const elmData = refs.get(this);
          if (!elmData.onReadyPromise) {
            elmData.onReadyPromise = new Promise(resolve => elmData.firedDidLoad ? resolve() : (elmData.onReadyResolve = resolve));
          }
          return elmData.onReadyPromise;

        } else if (BUILD.lazyLoad) {
          return resolved;
        }
      }

    }

    customElements.define(cmpMeta.tagNameMeta, initHostComponent(StencilLayHost as any, cmpMeta) as any);
  });
};
