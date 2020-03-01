import * as d from '../declarations';
import { appDidLoad, forceUpdate } from './update-component';
import { appendChildSlotFix, cloneNodeFix } from './dom-extras';
import { BUILD } from '@app-data';
import { CMP_FLAGS } from '@utils';
import { connectedCallback } from './connected-callback';
import { convertScopedToShadow, registerStyle } from './styles';
import { createTime, installDevTools } from './profile';
import { disconnectedCallback } from './disconnected-callback';
import { doc, getHostRef, plt, registerHost, win } from '@platform';
import { hmrStart } from './hmr-component';
import { HYDRATED_CSS, HYDRATED_STYLE_ID, PLATFORM_FLAGS, PROXY_FLAGS } from './runtime-constants';
import { proxyComponent } from './proxy-component';


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
  let i = 0;

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
    for (; i < styles.length; i++) {
      registerStyle(
        styles[i].getAttribute(HYDRATED_STYLE_ID),
        convertScopedToShadow(styles[i].innerHTML),
        true,
      );
    }
  }

  lazyBundles.map(lazyBundle =>
    lazyBundle[1].map(compactMeta => {
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
      if (BUILD.shadowDom && !plt.$supportsShadow$ && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
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

          registerHost(self, cmpMeta);
          if (BUILD.shadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
            // this component is using shadow dom
            // and this browser supports shadow dom
            // add the read-only property "shadowRoot" to the host element
            // adding the shadow root build conditionals to minimize runtime
            if (plt.$supportsShadow$) {

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

        forceUpdate() {
          forceUpdate(this);
        }

        componentOnReady() {
          return getHostRef(this).$onReadyPromise$;
        }
      };

      if (BUILD.cloneNodeFix) {
        cloneNodeFix(HostElement.prototype);
      }

      if (BUILD.appendChildSlotFix) {
        appendChildSlotFix(HostElement.prototype);
      }

      if (BUILD.hotModuleReplacement) {
        (HostElement as any).prototype['s-hmr'] = function (hmrVersionId: string) {
          hmrStart(this, cmpMeta, hmrVersionId);
        };
      }

      cmpMeta.$lazyBundleIds$ = lazyBundle[0];

      if (!exclude.includes(tagName) && !customElements.get(tagName)) {
        cmpTags.push(tagName);
        customElements.define(
          tagName,
          proxyComponent(HostElement as any, cmpMeta, PROXY_FLAGS.isElementConstructor) as any
        );
      }
    }));

  if (BUILD.hydratedClass || BUILD.hydratedAttribute) {
    visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
    visibilityStyle.setAttribute('data-styles', '');
    head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
  }

  // Process deferred connectedCallbacks now all components have been registered
  isBootstrapping = false;
  if (deferredConnectedCallbacks.length) {
    deferredConnectedCallbacks.map(host => host.connectedCallback());
  } else {
    if (BUILD.profile) {
      plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30, 'timeout'));
    } else {
      plt.jmp(() => appLoadFallback = setTimeout(appDidLoad, 30));
    }
  }
  // Fallback appLoad event
  endBootstrap();
};
