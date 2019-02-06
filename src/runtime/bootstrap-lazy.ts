import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { hostRefs, registerHost } from '@platform';
import { initialLoad } from './initial-load';
import { proxyComponent } from './proxy-component';
import { update } from './update';
import { componentOnReady } from './component-on-ready';


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
          return componentOnReady(hostRefs.get(this));
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
