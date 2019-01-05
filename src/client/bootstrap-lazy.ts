import * as d from '../declarations';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { initHostComponent } from './init-host-component';
import { refs } from './data';
import { resolved } from './task-queue';


export const bootstrapLazy = (lazyBundles: d.LazyBundleRuntimeMeta[]) => {
  // bootstrapLazy

  // [{ios: 'abc12345', md: 'dec65432'}, ['ion-icon', []], ['ion-button',[]]]

  lazyBundles.forEach(lazyBundle =>

    lazyBundle[1].forEach(cmpLazyMeta => {

      cmpLazyMeta.lazyBundleIds = lazyBundle[0];

      class StencilLayHost extends HTMLElement {
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

      customElements.define(
        cmpLazyMeta.cmpTag,
        initHostComponent(StencilLayHost as any, cmpLazyMeta)
      );
    })

  );
};
