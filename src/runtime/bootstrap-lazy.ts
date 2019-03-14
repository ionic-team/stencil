import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { connectedCallback } from './connected-callback';
import { convertToShadowCss } from './client-hydrate';
import { disconnectedCallback } from './disconnected-callback';
import { getDoc, getHead, getHostRef, registerHost, supportsShadowDom } from '@platform';
import { postUpdateComponent, scheduleUpdate } from './update-component';
import { proxyComponent } from './proxy-component';
import { CMP_FLAG } from '@utils';
import { HTMLElement } from './html-element';


export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData) => {
  // bootstrapLazy

  const cmpTags: string[] = [];

  if (BUILD.hydrateClientSide && BUILD.shadowDom) {
    getDoc().querySelectorAll('style[h-id]')
      .forEach(convertToShadowCss);
  }

  lazyBundles.forEach(lazyBundle =>

    lazyBundle[1].forEach(cmpLazyMeta => {

      cmpLazyMeta.$lazyBundleIds$ = lazyBundle[0];

      if (!customElements.get(cmpLazyMeta.t)) {
        if (BUILD.style) {
          cmpTags.push(cmpLazyMeta.t);
        }
        customElements.define(
          cmpLazyMeta.t,
          proxyComponent(class extends HTMLElement {

            ['s-lr'] = false;
            ['s-rc']: (() => void)[] = [];

            // StencilLazyHost
            constructor(self: HTMLElement) {
              // @ts-ignore
              super(self);
              registerHost(this);
              if (BUILD.shadowDom && supportsShadowDom && cmpLazyMeta.f & CMP_FLAG.shadowDomEncapsulation) {
                // this component is using shadow dom
                // and this browser supports shadow dom
                // add the read-only property "shadowRoot" to the host element
                this.attachShadow({ 'mode': 'open' });
              }
            }

            connectedCallback() {
              connectedCallback(this, cmpLazyMeta);
            }

            disconnectedCallback() {
              if (BUILD.cmpDidUnload) {
                disconnectedCallback(this);
              }
            }

            's-init'() {
              const hostRef = getHostRef(this);
              if (hostRef.$lazyInstance$) {
                postUpdateComponent(this, hostRef);
              }
            }

            forceUpdate() {
              if (BUILD.updatable) {
                const hostRef = getHostRef(this);
                scheduleUpdate(
                  this,
                  hostRef,
                  cmpLazyMeta,
                  false
                );
              }
            }

            componentOnReady() {
              return getHostRef(this).$onReadyPromise$;
            }
          } as any, cmpLazyMeta, 1, 0) as any
        );
      }
    })

  );

  if (BUILD.style) {
    const visibilityStyle = getDoc().createElement('style');
    // visibilityStyle.innerHTML = cmpTags.map(t => `${t}:not(.hydrated)`) + '{display:none}';
    visibilityStyle.innerHTML = cmpTags + '{visibility:hidden}.hydrated{visibility:inherit}';
    visibilityStyle.setAttribute('data-styles', '');

    const y = getHead().querySelector('meta[charset]');
    getHead().insertBefore(visibilityStyle, y ? y.nextSibling : getHead().firstChild);
  }
};
