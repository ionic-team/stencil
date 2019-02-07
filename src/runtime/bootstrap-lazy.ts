import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { componentOnReady } from './component-on-ready';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { doc, getHostRef, registerHost } from '@platform';
import { initialLoad } from './initial-load';
import { proxyComponent } from './proxy-component';
import { update } from './update';


export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData) => {
  // bootstrapLazy

  const cmpTags: string[] = [];

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
          initialLoad(this, getHostRef(this), cmpLazyMeta);
        }

        forceUpdate() {
          if (BUILD.updatable) {
            const hostRef = getHostRef(this);
            update(
              this,
              BUILD.lazyLoad ? hostRef.lazyInstance : this,
              hostRef,
              cmpLazyMeta
            );
          }
        }

        componentOnReady(): any {
          return componentOnReady(getHostRef(this));
        }
      }

      if (!customElements.get(cmpLazyMeta.cmpTag)) {

        cmpTags.push(cmpLazyMeta.cmpTag);

        customElements.define(
          cmpLazyMeta.cmpTag,
          proxyComponent(StencilLazyHost as any, cmpLazyMeta, 1, 0) as any
        );
      }
    })

  );

  const visibilityStyle = doc.createElement('style');
  visibilityStyle.innerHTML = cmpTags + '{visibility:hidden}.hydrated{visibility:inherit}';
  visibilityStyle.setAttribute('data-styles', '');

  const y = doc.head.querySelector('meta[charset]');
  doc.head.insertBefore(visibilityStyle, y ? y.nextSibling : doc.head.firstChild);
};
