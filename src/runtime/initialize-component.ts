import type * as d from '../declarations';
import { BUILD } from '@app-data';
import { consoleError, loadModule, styles } from '@platform';
import { CMP_FLAGS, HOST_FLAGS } from '@utils';
import { proxyComponent } from './proxy-component';
import { safeCall, scheduleUpdate } from './update-component';
import { computeMode } from './mode';
import { getScopeId, registerStyle } from './styles';
import { PROXY_FLAGS } from './runtime-constants';
import { createTime, uniqueTime } from './profile';

export const initializeComponent = async (
  elm: d.HostElement,
  hostRef: d.HostRef,
  cmpMeta: d.ComponentRuntimeMeta,
  hmrVersionId?: string,
  Cstr?: any,
) => {
  // initializeComponent
  if (
    (BUILD.lazyLoad || BUILD.hydrateServerSide || BUILD.style) &&
    (hostRef.$flags$ & HOST_FLAGS.hasInitializedComponent) === 0
  ) {
    if (BUILD.lazyLoad || BUILD.hydrateClientSide) {
      // we haven't initialized this element yet
      hostRef.$flags$ |= HOST_FLAGS.hasInitializedComponent;

      // lazy loaded components
      // request the component's implementation to be
      // wired up with the host element
      Cstr = loadModule(cmpMeta, hostRef, hmrVersionId);
      if (Cstr.then) {
        // Await creates a micro-task avoid if possible
        const endLoad = uniqueTime(
          `st:load:${cmpMeta.$tagName$}:${hostRef.$modeName$}`,
          `[Stencil] Load module for <${cmpMeta.$tagName$}>`,
        );
        Cstr = await Cstr;
        endLoad();
      }
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
        proxyComponent(Cstr, cmpMeta, PROXY_FLAGS.proxyState);
        Cstr.isProxied = true;
      }

      const endNewInstance = createTime('createInstance', cmpMeta.$tagName$);
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
      if (BUILD.watchCallback) {
        hostRef.$flags$ |= HOST_FLAGS.isWatchReady;
      }
      endNewInstance();
      fireConnectedCallback(hostRef.$lazyInstance$);
    } else {
      // sync constructor component
      Cstr = elm.constructor as any;
      hostRef.$flags$ |= HOST_FLAGS.isWatchReady | HOST_FLAGS.hasInitializedComponent;
    }

    if (BUILD.style && Cstr.style) {
      // this component has styles but we haven't registered them yet
      let style = Cstr.style;

      if (BUILD.mode && typeof style !== 'string') {
        style = style[(hostRef.$modeName$ = computeMode(elm))];
        if (BUILD.hydrateServerSide && hostRef.$modeName$) {
          elm.setAttribute('s-mode', hostRef.$modeName$);
        }
      }
      const scopeId = getScopeId(cmpMeta, hostRef.$modeName$);
      if (!styles.has(scopeId)) {
        const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);

        if (
          !BUILD.hydrateServerSide &&
          BUILD.shadowDom &&
          BUILD.shadowDomShim &&
          cmpMeta.$flags$ & CMP_FLAGS.needsShadowDomShim
        ) {
          style = await import('../utils/shadow-css').then(m => m.scopeCss(style, scopeId, false));
        }

        registerStyle(scopeId, style, !!(cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation));
        endRegisterStyles();
      }
    }
  }

  // we've successfully created a lazy instance
  const ancestorComponent = hostRef.$ancestorComponent$;
  const schedule = () => scheduleUpdate(hostRef, true);

  if (BUILD.asyncLoading && ancestorComponent && ancestorComponent['s-rc']) {
    // this is the intial load and this component it has an ancestor component
    // but the ancestor component has NOT fired its will update lifecycle yet
    // so let's just cool our jets and wait for the ancestor to continue first

    // this will get fired off when the ancestor component
    // finally gets around to rendering its lazy self
    // fire off the initial update
    ancestorComponent['s-rc'].push(schedule);
  } else {
    schedule();
  }
};

export const fireConnectedCallback = (instance: any) => {
  if (BUILD.lazyLoad && BUILD.connectedCallback) {
    safeCall(instance, 'connectedCallback');
  }
};
