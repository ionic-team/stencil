import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { hostRefs, registerHost, tick } from '@platform';
import { initialLoad } from './initial-load';
import { proxyComponent } from './proxy-component';
import { update } from './update';


export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData) =>
  // bootstrapLazy

  lazyBundles.forEach(lazyBundle =>

    lazyBundle[1].forEach(cmpLazyMeta => {

      cmpLazyMeta.lazyBundleIds = lazyBundle[0];

      class StencilLazyHost extends HTMLElement {
        // StencilLazyHost
        constructor() {
          super();
          registerHost(this);
        }

        connectedCallback() {
          connectedCallback(this, cmpLazyMeta);
        }

        disconnectedCallback() {
          if (BUILD.lazyLoad || BUILD.vdomListener || BUILD.hostListener) {
            disconnectedCallback(this);
          }
        }

        's-init'() {
          initialLoad(this, hostRefs.get(this), cmpLazyMeta);
        }

        forceUpdate() {
          if (BUILD.updatable) {
            const hostRef = hostRefs.get(this);
            update(this,
              BUILD.lazyLoad ? hostRef.lazyInstance : this,
              hostRef,
              cmpLazyMeta
            );
          }
        }

        componentOnReady(): any {
          if (BUILD.lifecycle || BUILD.updatable) {
            const hostRef = hostRefs.get(this);
            if (!hostRef.onReadyPromise) {
              hostRef.onReadyPromise = new Promise(resolve => hostRef.hasRendered ? resolve() : (hostRef.onReadyResolve = resolve));
            }
            return hostRef.onReadyPromise;

          } else if (BUILD.lazyLoad) {
            return tick;
          }
        }

      }

      if (!customElements.get(cmpLazyMeta.cmpTag)) {
        customElements.define(
          cmpLazyMeta.cmpTag,
          proxyComponent(StencilLazyHost as any, cmpLazyMeta, 1, 0) as any
        );
      }
    })

  );
