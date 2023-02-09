import { BUILD } from '@app-data';
import { doc, getHostRef, plt, registerHost, supportsShadow, win } from '@platform';
import { CMP_FLAGS, queryNonceMetaTagContent } from '@utils';

import type * as d from '../declarations';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { hmrStart } from './hmr-component';
import { patchCloneNode, patchPseudoShadowDom } from './dom-extras';
import { createTime, installDevTools } from './profile';
import { proxyComponent } from './proxy-component';
import { HYDRATED_CSS, HYDRATED_STYLE_ID, PLATFORM_FLAGS, PROXY_FLAGS } from './runtime-constants';
import { convertScopedToShadow, getScopeId, registerStyle } from './styles';
import { appDidLoad } from './update-component';
import { computeMode } from './mode';

export { setNonce } from '@platform';

export const bootstrapLazy = (lazyBundles: d.LazyBundlesRuntimeData, options: d.CustomElementsDefineOptions = {}) => {
  if (BUILD.profile && performance.mark) {
    performance.mark('st:app:start');
  }
  installDevTools();

  const endBootstrap = createTime('bootstrapLazy');
  const cmpTags: string[] = [];
  const exclude = options.exclude || [];
  const customElements = win.customElements;
  const head = doc.head;
  const metaCharset = /*@__PURE__*/ head.querySelector('meta[charset]');
  const visibilityStyle = /*@__PURE__*/ doc.createElement('style');
  const deferredConnectedCallbacks: { connectedCallback: () => void }[] = [];
  const styles = /*@__PURE__*/ doc.querySelectorAll(`[${HYDRATED_STYLE_ID}]`);
  let appLoadFallback: any;
  let isBootstrapping = true;

  Object.assign(plt, options);
  plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
  if (BUILD.asyncQueue) {
    if (options.syncQueue) {
      plt.$flags$ |= PLATFORM_FLAGS.queueSync;
    }
  }
  if (BUILD.hydrateClientSide) {
    // If the app is already hydrated there is not point to disable the
    // async queue. This will improve the first input delay
    plt.$flags$ |= PLATFORM_FLAGS.appLoaded;
  }

  lazyBundles.map((lazyBundle) => {
    lazyBundle[1].map((compactMeta) => {
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
      if (BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
        cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
      }
      const tagName =
        BUILD.transformTagName && options.transformTagName
          ? options.transformTagName(cmpMeta.$tagName$)
          : cmpMeta.$tagName$;
      const HostElement = class extends HTMLElement {
        ['s-p']: Promise<void>[];
        ['s-rc']: (() => void)[];

        // StencilLazyHost
        constructor(self: HTMLElement) {
          // @ts-ignore
          super(self);
          self = this;

          if (BUILD.hydrateClientSide && BUILD.shadowDom) {
            const scopeId = getScopeId(cmpMeta, computeMode(self));
            const style = Array.from(styles).find((style) => style.getAttribute(HYDRATED_STYLE_ID) === scopeId);

            if (style) {
              if (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
                registerStyle(scopeId, convertScopedToShadow(style.innerHTML), true);
              } else {
                registerStyle(scopeId, style.innerHTML, false);
              }
            }
          }

          registerHost(self, cmpMeta);
          if (BUILD.shadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
            // this component is using shadow dom
            // and this browser supports shadow dom
            // add the read-only property "shadowRoot" to the host element
            // adding the shadow root build conditionals to minimize runtime
            if (supportsShadow) {
              if (BUILD.shadowDelegatesFocus) {
                self.attachShadow({
                  mode: 'open',
                  delegatesFocus: !!(cmpMeta.$flags$ & CMP_FLAGS.shadowDelegatesFocus),
                });
              } else {
                self.attachShadow({ mode: 'open' });
              }
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
          if (isBootstrapping) {
            // connectedCallback will be processed once all components have been registered
            deferredConnectedCallbacks.push(this);
          } else {
            plt.jmp(() => connectedCallback(this));
          }
        }

        disconnectedCallback() {
          plt.jmp(() => disconnectedCallback(this));
        }

        componentOnReady() {
          return getHostRef(this).$onReadyPromise$;
        }
      };

      if (
        !BUILD.hydrateServerSide &&
        (cmpMeta.$flags$ & CMP_FLAGS.hasSlotRelocation ||
          cmpMeta.$flags$ & (CMP_FLAGS.shadowDomEncapsulation && CMP_FLAGS.needsShadowDomShim))
      ) {
        patchPseudoShadowDom(HostElement.prototype);
        if (BUILD.cloneNodeFix) {
          patchCloneNode(HostElement.prototype);
        }
      }

      if (BUILD.hotModuleReplacement) {
        (HostElement as any).prototype['s-hmr'] = function (hmrVersionId: string) {
          hmrStart(this, cmpMeta, hmrVersionId);
        };
      }

      cmpMeta.$lazyBundleId$ = lazyBundle[0];

      if (!exclude.includes(tagName) && !customElements.get(tagName)) {
        cmpTags.push(tagName);
        customElements.define(
          tagName,
          proxyComponent(HostElement as any, cmpMeta, PROXY_FLAGS.isElementConstructor) as any
        );
      }
    });
  });

  if (BUILD.invisiblePrehydration && (BUILD.hydratedClass || BUILD.hydratedAttribute)) {
    visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
    visibilityStyle.setAttribute('data-styles', '');

    // Apply CSP nonce to the style tag if it exists
    const nonce = plt.$nonce$ ?? queryNonceMetaTagContent(doc);
    if (nonce != null) {
      visibilityStyle.setAttribute('nonce', nonce);
    }
    head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
  }

  // Process deferred connectedCallbacks now all components have been registered
  isBootstrapping = false;
  if (deferredConnectedCallbacks.length) {
    deferredConnectedCallbacks.map((host) => host.connectedCallback());
  } else {
    if (BUILD.profile) {
      plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30, 'timeout')));
    } else {
      plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30)));
    }
  }
  // Fallback appLoad event
  endBootstrap();
};
