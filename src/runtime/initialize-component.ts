import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError, loadModule, plt, styles, writeTask } from '@platform';
import { HOST_STATE } from '@utils';
import { proxyComponent } from './proxy-component';
import { updateComponent } from './update-component';


export const initializeComponent = async (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, Cstr?: d.ComponentConstructor) => {
  // initialLoad

  if (!hostRef.hasInitializedComponent) {
    // we haven't initialized this element yet
    hostRef.hasInitializedComponent = true;

    if (BUILD.mode && !elm.mode) {
      // initialLoad, BUILD.mode
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global mode
      elm.mode = elm.getAttribute('mode') || plt.appMode;
    }

    if (BUILD.lazyLoad) {
      // lazy loaded components
      try {
        // request the component's implementation to be
        // wired up with the host element
        Cstr = await loadModule(elm, (cmpMeta as d.ComponentLazyRuntimeMeta).lazyBundleIds);

        if (BUILD.member && !Cstr.isProxied) {
          // we'eve never proxied this Constructor before
          // let's add the getters/setters to its prototype before
          // the first time we create an instance of the implementation
          proxyComponent(Cstr, cmpMeta, 0, 1);
          Cstr.isProxied = true;
        }

        if (BUILD.style && !Cstr.isStyleRegistered && Cstr.style) {
          // this component has styles but we haven't registered them yet
          if (BUILD.mode && Cstr.mode) {
            // this component implementation has a style mode
            // use the given mode as the style key
            styles.set(Cstr.mode, Cstr.style);

          } else {
            // this component implementation does not have a style mode
            // use the tag name as the key (note, tag name will be all caps)
            styles.set(elm.tagName, Cstr.style);
          }
          Cstr.isStyleRegistered = true;
        }

        // ok, time to construct the instance
        // but let's keep track of when we start and stop
        // so that the getters/setters don't incorrectly step on data
        BUILD.member && (hostRef.flags |= HOST_STATE.isConstructingInstance);
        try {
          // construct the lazy-loaded component implementation
          // passing the hostRef is very important during
          // construction in order to directly wire together the
          // host element and the lazy-loaded instance
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
      // the component instance and the host element are the same thing
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
  }

  if (!BUILD.lazyLoad || hostRef.lazyInstance) {
    // we've successfully created a lazy instance

    if (BUILD.lifecycle && hostRef.ancestorHostElement && !hostRef.ancestorHostElement['s-rn']) {
      // this is the intial load and this element has an ancestor host element
      // but the ancestor host element has NOT rendered yet
      // so let's just cool our jets and wait for the ancestor to render
      (hostRef.ancestorHostElement['s-rc'] = hostRef.ancestorHostElement['s-rc'] || []).push(() =>
        // this will get fired off when the ancestor host element
        // finally gets around to rendering its lazy self
        // fire off the initial update
        initializeComponent(elm, hostRef, cmpMeta)
      );

    } else {
      // there is no ancestorHostElement or the ancestorHostElement has rendered
      // fire off the initial update
      if (BUILD.taskQueue) {
        writeTask(() => updateComponent(elm, (BUILD.lazyLoad ? hostRef.lazyInstance : elm as any), hostRef, cmpMeta, true));
      } else {
        updateComponent(elm, (BUILD.lazyLoad ? hostRef.lazyInstance : elm as any), hostRef, cmpMeta, true);
      }
    }
  }
};
