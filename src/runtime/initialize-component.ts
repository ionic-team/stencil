import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, loadModule } from '@platform';
import { CMP_FLAGS, HOST_FLAGS } from '@utils';
import { proxyComponent } from './proxy-component';
import { scheduleUpdate } from './update-component';
import { computeMode } from './mode';
import { getScopeId, registerStyle } from './styles';
import { fireConnectedCallback } from './connected-callback';


export const initializeComponent = async (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, hmrVersionId?: string, Cstr?: d.ComponentConstructor) => {
  // initializeComponent
  if ((BUILD.lazyLoad || BUILD.style) && (hostRef.$flags$ & HOST_FLAGS.hasInitializedComponent) === 0) {
    // we haven't initialized this element yet
    hostRef.$flags$ |= HOST_FLAGS.hasInitializedComponent;

    if (BUILD.mode && hostRef.$modeName$ == null) {
      // initializeComponent
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      hostRef.$modeName$ = typeof cmpMeta.$lazyBundleIds$ !== 'string' ? computeMode(elm) : '';
    }
    if (BUILD.hydrateServerSide && hostRef.$modeName$) {
      elm.setAttribute('s-mode', hostRef.$modeName$);
    }

    if (BUILD.lazyLoad) {
      // lazy loaded components
      // request the component's implementation to be
      // wired up with the host element
      Cstr = await loadModule(cmpMeta, hostRef, hmrVersionId);
      if ((BUILD.isDev || BUILD.isDebug) && !Cstr) {
        throw new Error(`Constructor for "${cmpMeta.$tagName$}#${hostRef.$modeName$}" was not found`);
      }
      if (BUILD.member && !Cstr.isProxied) {
        // we'eve never proxied this Constructor before
        // let's add the getters/setters to its prototype before
        // the first time we create an instance of the implementation
        if (BUILD.watchCallback) {
          cmpMeta.$watchers$ = Cstr.watchers;
        }
        proxyComponent(Cstr, cmpMeta, 0, 1);
        Cstr.isProxied = true;
      }

      // ok, time to construct the instance
      // but let's keep track of when we start and stop
      // so that the getters/setters don't incorrectly step on data
      if (BUILD.member) {
        hostRef.$flags$ |= HOST_FLAGS.isConstructingInstance;
      }
      // construct the lazy-loaded component implementation
      // passing the hostRef is very important during
      // construction in order to directly wire together the
      // host element and the lazy-loaded instance
      try {
        new (Cstr as any)(hostRef);
      } catch (e) {
        consoleError(e);
      }

      if (BUILD.member) {
        hostRef.$flags$ &= ~HOST_FLAGS.isConstructingInstance;
      }
      fireConnectedCallback(hostRef.$lazyInstance$);

    } else {
      Cstr = elm.constructor as any;
    }

    if (BUILD.style && !Cstr.isStyleRegistered && Cstr.style) {
      // this component has styles but we haven't registered them yet
      let style = Cstr.style;
      let scopeId = getScopeId(cmpMeta.$tagName$, hostRef.$modeName$);
      if (!BUILD.hydrateServerSide && BUILD.shadowDom && cmpMeta.$flags$ & CMP_FLAGS.needsShadowDomShim) {
        style = await import('../utils/shadow-css').then(m => m.scopeCss(style, scopeId, false));
      }
      registerStyle(scopeId, style);
      Cstr.isStyleRegistered = true;
    }
  }

  // we've successfully created a lazy instance
  const ancestorComponent = hostRef.$ancestorComponent$;
  if (BUILD.lifecycle && ancestorComponent && !ancestorComponent['s-lr'] && ancestorComponent['s-rc']) {
    // this is the intial load and this component it has an ancestor component
    // but the ancestor component has NOT fired its will update lifecycle yet
    // so let's just cool our jets and wait for the ancestor to continue first
    ancestorComponent['s-rc'].push(() =>
      // this will get fired off when the ancestor component
      // finally gets around to rendering its lazy self
      // fire off the initial update
      initializeComponent(elm, hostRef, cmpMeta)
    );

  } else {
    scheduleUpdate(elm, hostRef, cmpMeta, true);
  }
};
