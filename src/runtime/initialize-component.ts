import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, loadModule, styles } from '@platform';
import { HOST_STATE } from '@utils';
import { proxyComponent } from './proxy-component';
import { scheduleUpdate } from './update-component';
import { computeMode } from './mode';


export const initializeComponent = async (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, Cstr?: d.ComponentConstructor) => {
  // initializeComponent
  if ((BUILD.lazyLoad || BUILD.style) && !(hostRef.$stateFlags$ & HOST_STATE.hasInitializedComponent)) {
    // we haven't initialized this element yet
    hostRef.$stateFlags$ |= HOST_STATE.hasInitializedComponent;

    if (BUILD.lazyLoad) {
      // lazy loaded components
      if (BUILD.mode && hostRef.$modeName$ === undefined) {
        // initializeComponent, BUILD.mode
        // looks like mode wasn't set as a property directly yet
        // first check if there's an attribute
        // next check the app's global
        hostRef.$modeName$ = typeof (cmpMeta as d.ComponentLazyRuntimeMeta).$lazyBundleIds$ !== 'string' ? computeMode(elm) : '';
      }
      try {
        // request the component's implementation to be
        // wired up with the host element
        Cstr = await loadModule(cmpMeta, hostRef);

        if (BUILD.member && !Cstr.isProxied) {
          // we'eve never proxied this Constructor before
          // let's add the getters/setters to its prototype before
          // the first time we create an instance of the implementation
          proxyComponent(Cstr, cmpMeta, 0, 1);
          Cstr.isProxied = true;
        }

        // ok, time to construct the instance
        // but let's keep track of when we start and stop
        // so that the getters/setters don't incorrectly step on data
        BUILD.member && (hostRef.$stateFlags$ |= HOST_STATE.isConstructingInstance);

        // construct the lazy-loaded component implementation
        // passing the hostRef is very important during
        // construction in order to directly wire together the
        // host element and the lazy-loaded instance
        new (Cstr as any)(hostRef);

        BUILD.member && (hostRef.$stateFlags$ &= ~HOST_STATE.isConstructingInstance);

      } catch (e) {
        consoleError(e);
      }

    } else if (BUILD.hydrateServerSide) {
      Cstr = elm.constructor as any;
    }

    if (BUILD.style && !Cstr.isStyleRegistered && Cstr.style) {
      // this component has styles but we haven't registered them yet
      styles.set(BUILD.mode ? cmpMeta.t + '#' + hostRef.$modeName$ : cmpMeta.t, Cstr.style);
      Cstr.isStyleRegistered = true;
    }
  }

  // we've successfully created a lazy instance

  if (BUILD.lifecycle && hostRef.$ancestorComponent$ && !hostRef.$ancestorComponent$['s-lr']) {
    // this is the intial load and this component it has an ancestor component
    // but the ancestor component has NOT fired its will update lifecycle yet
    // so let's just cool our jets and wait for the ancestor to continue first
    (hostRef.$ancestorComponent$['s-rc'] = hostRef.$ancestorComponent$['s-rc'] || []).push(() =>
      // this will get fired off when the ancestor component
      // finally gets around to rendering its lazy self
      // fire off the initial update
      initializeComponent(elm, hostRef, cmpMeta)
    );

  } else {
    scheduleUpdate(elm, hostRef, cmpMeta, true);
  }
};
