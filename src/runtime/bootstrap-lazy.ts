import { proxyComponent } from './proxy-component';
import * as d from '../declarations';
import { CMP_FLAGS } from '@utils';
import { connectedCallback } from './connected-callback';
import { convertScopedToShadow, registerStyle } from './styles';
import { disconnectedCallback } from './disconnected-callback';
import { BUILD } from '@build-conditionals';
import { doc, getHostRef, plt, registerHost, supportsShadowDom, win } from '@platform';
import { hmrStart } from './hmr-component';
import { HYDRATE_ID, PLATFORM_FLAGS, PROXY_FLAGS } from './runtime-constants';
import { appDidLoad, forceUpdate, postUpdateComponent } from './update-component';


export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData, options: d.CustomElementsDefineOptions = {}) => {
  const cmpTags: string[] = [];
  const exclude = options.exclude || [];
  const head = doc.head;
  const customElements = win.customElements;
  const y = /*@__PURE__*/head.querySelector('meta[charset]');
  const visibilityStyle = /*@__PURE__*/doc.createElement('style');
  let appLoadFallback: any;
  Object.assign(plt, options);
  plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
  if (options.syncQueue) {
    plt.$flags$ |= PLATFORM_FLAGS.queueSync;
  }
  if (BUILD.hydrateClientSide && BUILD.shadowDom) {
    const styles = doc.querySelectorAll('style[s-id]');
    let globalStyles = '';
    styles.forEach(styleElm => globalStyles += styleElm.innerHTML);
    styles.forEach(styleElm => {
      registerStyle(
        styleElm.getAttribute(HYDRATE_ID),
        globalStyles + convertScopedToShadow(styleElm.innerHTML),
        true,
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
      if (BUILD.shadowDom && !supportsShadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
        cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
      }
      const tagName = cmpMeta.$tagName$;
      const HostElement = class extends HTMLElement {

        ['s-lr']: boolean;
        ['s-rc']: (() => void)[];

        // StencilLazyHost
        constructor(self: HTMLElement) {
          // @ts-ignore
          super(self);
          self = this;

          if (BUILD.lifecycle) {
            this['s-lr'] = false;
            this['s-rc'] = [];
          }

          registerHost(self);
          if (BUILD.shadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
            // this component is using shadow dom
            // and this browser supports shadow dom
            // add the read-only property "shadowRoot" to the host element
            if (supportsShadowDom) {
              self.attachShadow({ 'mode': 'open' });
            } else if (!BUILD.hydrateServerSide && !('shadowRoot' in self)) {
              (self as any).shadowRoot = self;
            }
          }
        }

        connectedCallback() {
          if (appLoadFallback) {
            clearTimeout(appLoadFallback);
            appLoadFallback = null;
          }
          plt.jmp(() => connectedCallback(this, cmpMeta));
        }

        disconnectedCallback() {
          plt.jmp(() => disconnectedCallback(this));
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
          forceUpdate(this, cmpMeta);
        }

        componentOnReady() {
          return getHostRef(this).$onReadyPromise$;
        }
      };
      cmpMeta.$lazyBundleIds$ = lazyBundle[0];

      if (!exclude.includes(tagName) && !customElements.get(tagName)) {
        cmpTags.push(tagName);
        customElements.define(
          tagName,
          proxyComponent(HostElement as any, cmpMeta, PROXY_FLAGS.isElementConstructor) as any
        );
      }
    }));

  // visibilityStyle.innerHTML = cmpTags.map(t => `${t}:not(.hydrated)`) + '{display:none}';
  visibilityStyle.innerHTML = cmpTags + '{visibility:hidden}.hydrated{visibility:inherit}';
  visibilityStyle.setAttribute('data-styles', '');
  head.insertBefore(visibilityStyle, y ? y.nextSibling : head.firstChild);

  // Fallback appLoad event
  plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30));
};
