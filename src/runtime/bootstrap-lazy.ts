import * as d from '@declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { connectedCallback } from './connected';
import { getElmRef, resolved } from '@stencil/core/platform';
import { disconnectedCallback } from './disconnected';
import { initHostComponent } from './init-host-component';
import { initialLoad } from './initial-load';
import { update } from './update';


export const bootstrapLazy = (lazyBundles: d.LazyBundleRuntimeMeta[]) => {
  // bootstrapLazy

  lazyBundles.forEach(lazyBundle =>

    lazyBundle[1].forEach(cmpLazyMeta => {

      cmpLazyMeta.lazyBundleIds = lazyBundle[0];

      class StencilLazyHost extends HTMLElement {
        // StencilLazyHost

        connectedCallback() {
          connectedCallback(this);
        }

        disconnectedCallback() {
          if (BUILD.lazyLoad || BUILD.vdomListener || BUILD.listener) {
            disconnectedCallback(this);
          }
        }

        's-init'() {
          initialLoad(this, getElmRef(this), cmpLazyMeta);
        }

        forceUpdate() {
          if (BUILD.updatable) {
            const elmData = getElmRef(this);
            update(this, elmData.instance, elmData, cmpLazyMeta);
          }
        }

        componentOnReady(): any {
          if (BUILD.lifecycle || BUILD.updatable) {
            const elmData = getElmRef(this);
            if (!elmData.onReadyPromise) {
              elmData.onReadyPromise = new Promise(resolve => elmData.hasRendered ? resolve() : (elmData.onReadyResolve = resolve));
            }
            return elmData.onReadyPromise;

          } else if (BUILD.lazyLoad) {
            return resolved;
          }
        }

      }

      if (!customElements.get(cmpLazyMeta.cmpTag)) {
        customElements.define(
          cmpLazyMeta.cmpTag,
          initHostComponent(StencilLazyHost as any, cmpLazyMeta)
        );
      }
    })

  );
};
