import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, doc, loadModule, plt, styles, writeTask } from '@platform';
import { proxyComponent } from './proxy-component';
import { update } from './update';
import { HOST_STATE } from '@utils';


export const initialLoad = async (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, Cstr?: d.ComponentConstructor) => {
  // initialConnect
  if (BUILD.lifecycle && hostRef.ancestorHostElement && !hostRef.ancestorHostElement['s-rn']) {
    // initUpdate, BUILD.lifecycle
    // this is the intial load
    // this element has an ancestor host element
    // but the ancestor host element has NOT rendered yet
    // so let's just cool our jets and wait for the ancestor to render
    (hostRef.ancestorHostElement['s-rc'] = hostRef.ancestorHostElement['s-rc'] || []).push(() =>
      // this will get fired off when the ancestor host element
      // finally gets around to rendering its lazy self
      initialLoad(elm, hostRef, cmpMeta)
    );

  } else {

    if (BUILD.mode && !elm.mode) {
      // initUpdate, BUILD.mode
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = elm.getAttribute('mode') || plt.appMode;
    }

    if (BUILD.slotPolyfill) {
      // initUpdate, BUILD.slotPolyfill
      // if the slot polyfill is required we'll need to put some nodes
      // in here to act as original content anchors as we move nodes around
      // host element has been connected to the DOM
      if (!elm['s-cr'] && (!plt.supportsShadowDom || !cmpMeta.cmpScopedCssEncapsulation)) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        elm['s-cr'] = doc.createTextNode('') as any;
        elm['s-cr']['s-cn'] = true;
        elm.insertBefore(elm['s-cr'], elm.firstChild);
      }

      if ((BUILD.es5 || BUILD.scoped) && !plt.supportsShadowDom && cmpMeta.cmpScopedCssEncapsulation) {
        // initUpdate, BUILD.es5 || scoped
        // this component should use shadow dom
        // but this browser doesn't support it
        // so let's polyfill a few things for the user

        if (BUILD.isDev) {
          // it's possible we're manually forcing the slot polyfill
          // but this browser may already support the read-only shadowRoot
          // do an extra check here, but only for dev mode on the client
          if (!('shadowRoot' in HTMLElement.prototype)) {
            (elm as any).shadowRoot = elm;
          }

        } else {
          (elm as any).shadowRoot = elm;
        }
      }
    }

    if (BUILD.lazyLoad) {
      // lazy loaded components
      try {
        Cstr = await loadModule(elm, (cmpMeta as d.ComponentLazyRuntimeMeta).lazyBundleIds);

        if (BUILD.member && !Cstr.isProxied) {
          // we'eve never proxied this Constructor before
          // let's add the getters/setters to its prototype
          proxyComponent(Cstr, cmpMeta, 0, 1);
          Cstr.isProxied = true;
        }

        if (BUILD.style && !Cstr.isStyleRegistered && Cstr.style) {
          if (BUILD.mode && Cstr.mode) {
            styles.set(Cstr.mode, Cstr.style);
          } else {
            styles.set(elm.tagName, Cstr.style);
          }
          Cstr.isStyleRegistered = true;
        }

        // ok, time to construct the instance
        // but let's keep track of when we start and stop
        // so that the getters/setters don't incorrectly step on data
        BUILD.member && (hostRef.flags |= HOST_STATE.isConstructingInstance);
        try {
          new (Cstr as any)(hostRef);
        } catch (err) {
          consoleError(err);
        }
        BUILD.member && (hostRef.flags &= ~HOST_STATE.isConstructingInstance);

        if (BUILD.hostListener && hostRef.queuedReceivedHostEvents) {
          // events may have already fired before the instance was even ready
          // now that the instance is ready, let's replay all of the events that
          // we queued up earlier that were originally meant for the instance
          for (let i = 0; i < hostRef.queuedReceivedHostEvents.length; i += 2) {
            // data was added in sets of two
            // first item the eventMethodName
            // second item is the event data
            // take a look at hostEventListenerProxy()
            try {
              hostRef.lazyInstance[hostRef.queuedReceivedHostEvents[i]](hostRef.queuedReceivedHostEvents[i + 1]);
            } catch (err) {
              consoleError(err);
            }
          }
          hostRef.queuedReceivedHostEvents = undefined;
        }

      } catch (e) {
        consoleError(e);
      }

    } else {
      // native components
      if (BUILD.style) {
        Cstr = elm.constructor as any;
        if (!Cstr.isStyleRegistered && Cstr.style) {
          if (BUILD.mode && Cstr.mode) {
            styles.set(Cstr.mode, Cstr.style);
          } else {
            styles.set(elm.tagName, Cstr.style);
          }
          Cstr.isStyleRegistered = true;
        }
      }
    }

    if (BUILD.taskQueue) {
      writeTask(() => update(elm, (BUILD.lazyLoad ? hostRef.lazyInstance : elm as any), hostRef, cmpMeta, true));
    } else {
      update(elm, (BUILD.lazyLoad ? hostRef.lazyInstance : elm as any), hostRef, cmpMeta, true);
    }
  }
};
