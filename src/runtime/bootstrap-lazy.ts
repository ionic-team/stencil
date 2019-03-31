import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CMP_FLAG } from '@utils';
import { connectedCallback } from './connected-callback';
import { convertScopedToShadow, registerStyle } from './styles';
import { disconnectedCallback } from './disconnected-callback';
import { proxyComponent } from './proxy-component';
import { getHostRef, registerHost, supportsShadowDom } from '@platform';
import { hmrStart } from './hmr-component';
import { HTMLElement } from './html-element';
import { HYDRATE_ID } from './runtime-constants';
import { postUpdateComponent, scheduleUpdate } from './update-component';


export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData, win: Window, options: d.CustomElementsDefineOptions = {}) => {
  const cmpTags: string[] = [];
  const exclude = options.exclude || [];
  const doc = win.document;
  const head = doc.head;
  const customElements = win.customElements;
  const y = /*@__PURE__*/head.querySelector('meta[charset]');
  const visibilityStyle = /*@__PURE__*/doc.createElement('style');

  if (BUILD.hydrateClientSide && BUILD.shadowDom) {
    const styles = doc.querySelectorAll('style[s-id]');
    let globalStyles = '';
    styles.forEach(styleElm => globalStyles += styleElm.innerHTML);
    styles.forEach(styleElm => {
      registerStyle(
        styleElm.getAttribute(HYDRATE_ID),
        globalStyles + convertScopedToShadow(styleElm.innerHTML)
      );
    });
  }

  lazyBundles.forEach(lazyBundle =>
    lazyBundle[1].forEach(compactMeta => {
      const cmpMeta: d.ComponentRuntimeMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3],
      };
      if (BUILD.reflect) {
        cmpMeta.$attrsToReflect$ = [];
      }
      if (BUILD.watchCallback) {
        cmpMeta.$watchers$ = {};
      }
      const tagName = cmpMeta.$tagName$;
      const HostElement = class extends HTMLElement {
        ['s-lr'] = false;
        ['s-rc']: (() => void)[] = [];

        // StencilLazyHost
        constructor(self: HTMLElement) {
          // @ts-ignore
          super(self);
          registerHost(this);
          if (BUILD.shadowDom && supportsShadowDom && cmpMeta.$flags$ & CMP_FLAG.shadowDomEncapsulation) {
            // this component is using shadow dom
            // and this browser supports shadow dom
            // add the read-only property "shadowRoot" to the host element
            this.attachShadow({ 'mode': 'open' });
          }
        }

        connectedCallback() {
          connectedCallback(this, cmpMeta);
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

        's-hmr'(hmrVersionId: string) {
          if (BUILD.hotModuleReplacement) {
            hmrStart(this, cmpMeta, hmrVersionId);
          }
        }

        forceUpdate() {
          if (BUILD.updatable) {
            const hostRef = getHostRef(this);
            scheduleUpdate(
              this,
              hostRef,
              cmpMeta,
              false
            );
          }
        }

        componentOnReady() {
          return getHostRef(this).$onReadyPromise$;
        }
      };
      cmpMeta.$lazyBundleIds$ = lazyBundle[0];

      if (!exclude.includes(tagName) && !customElements.get(tagName)) {
        if (BUILD.style) {
          cmpTags.push(tagName);
        }
        customElements.define(
          tagName,
          proxyComponent(HostElement as any, cmpMeta, 1, 0) as any
        );
      }
    }));


  if (BUILD.style) {
    // visibilityStyle.innerHTML = cmpTags.map(t => `${t}:not(.hydrated)`) + '{display:none}';
    visibilityStyle.innerHTML = cmpTags + '{visibility:hidden}.hydrated{visibility:inherit}';
    visibilityStyle.setAttribute('data-styles', '');
    head.insertBefore(visibilityStyle, y ? y.nextSibling : head.firstChild);
  }
};
