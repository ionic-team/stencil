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
import { appDidLoad, forceUpdate } from './update-component';
import { createTime } from './profile';


export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData, options: d.CustomElementsDefineOptions = {}) => {
  // if (BUILD.profile) {
  //   performance.mark('st:app:start');
  // }
  const endBootstrap = createTime('bootstrapLazy');
  const cmpTags: string[] = [];
  const exclude = options.exclude || [];
  const head = doc.head;
  const customElements = win.customElements;
  const y = /*@__PURE__*/head.querySelector('meta[charset]');
  const visibilityStyle = /*@__PURE__*/doc.createElement('style');
  let appLoadFallback: any;
  const deferredConnectedCallbacks: {connectedCallback: () => void}[] = [];
  let isBootstrapping = true;

  Object.assign(plt, options);
  plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
  if (options.syncQueue) {
    plt.$flags$ |= PLATFORM_FLAGS.queueSync;
  }
  if (BUILD.hydrateClientSide) {
    // If the app is already hydrated there is not point to disable the
    // async queue. This will improve the first input delay
    plt.$flags$ |= PLATFORM_FLAGS.appLoaded;
  }
  if (BUILD.hydrateClientSide && BUILD.shadowDom) {
    const styles = doc.querySelectorAll('style[s-id]');
    let globalStyles = '';
    let i = 0;
    for (; i < styles.length; i++) {
      globalStyles += styles[i].innerHTML;
    }
    for (i = 0; i < styles.length; i++) {
      const styleElm = styles[i];
      registerStyle(
        styleElm.getAttribute(HYDRATE_ID),
        globalStyles + convertScopedToShadow(styleElm.innerHTML),
        true,
      );
    }
  }

  lazyBundles.forEach(lazyBundle =>
    lazyBundle[1].forEach(compactMeta => {
      const cmpMeta: d.ComponentRuntimeMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3],
      };
      if (BUILD.member) {
        cmpMeta.$members$ = compactMeta[2];
      }
      if (BUILD.hostListener) {
        cmpMeta.$listeners$ = compactMeta[3];
      }
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

        ['s-p']: Promise<void>[];
        ['s-rc']: (() => void)[];

        // StencilLazyHost
        constructor(self: HTMLElement) {
          // @ts-ignore
          super(self);
          self = this;

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
          if (isBootstrapping) {
            // connectedCallback will be processed once all components have been registered
            deferredConnectedCallbacks.push(this);
          } else {
            if (appLoadFallback) {
              clearTimeout(appLoadFallback);
              appLoadFallback = null;
            }

            plt.jmp(() => connectedCallback(this, cmpMeta));
          }
        }

        disconnectedCallback() {
          plt.jmp(() => disconnectedCallback(this));
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
        customElements.define(
          tagName,
          proxyComponent(HostElement as any, cmpMeta, PROXY_FLAGS.isElementConstructor) as any
        );
      }
    }));

  // Process deferred connectedCallbacks now all components have been registered
  isBootstrapping = false;
  deferredConnectedCallbacks.forEach(host => host.connectedCallback());

  // visibilityStyle.innerHTML = cmpTags.map(t => `${t}:not(.hydrated)`) + '{display:none}';
  visibilityStyle.innerHTML = cmpTags + '{visibility:hidden}.hydrated{visibility:inherit}';
  visibilityStyle.setAttribute('data-styles', '');
  head.insertBefore(visibilityStyle, y ? y.nextSibling : head.firstChild);

  // Fallback appLoad event
  plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30));
  endBootstrap();
};
