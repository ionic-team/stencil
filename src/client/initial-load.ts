import * as d from '../declarations';
import { appMode, supportsShadowDom } from './data';
import { consoleError } from './log';
import { loadModuleImport } from './load-module-import';
import { proxyComponent } from './proxy-component';
import { update } from './update';
import { writeTask } from './task-queue';


export const initialLoad = async (elm: d.HostElement, elmData: d.ElementData, cmpMeta?: d.ComponentRuntimeMeta) => {
  // initialConnect
  cmpMeta = (elm as any).constructor.cmpMeta;

  if (BUILD.lifecycle && elmData.ancestorHostElement && !elmData.ancestorHostElement['s-rn']) {
    // initUpdate, BUILD.lifecycle
    // this is the intial load
    // this element has an ancestor host element
    // but the ancestor host element has NOT rendered yet
    // so let's just cool our jets and wait for the ancestor to render
    (elmData.ancestorHostElement['s-rc'] = elmData.ancestorHostElement['s-rc'] || []).push(() =>
      // this will get fired off when the ancestor host element
      // finally gets around to rendering its lazy self
      initialLoad(elm, elmData)
    );

  } else {

    if (BUILD.mode && !elm.mode) {
      // initUpdate, BUILD.mode
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = elm.getAttribute('mode') || appMode;
    }

    if (BUILD.slotPolyfill) {
      // initUpdate, BUILD.slotPolyfill
      // if the slot polyfill is required we'll need to put some nodes
      // in here to act as original content anchors as we move nodes around
      // host element has been connected to the DOM
      if (!elm['s-cr'] && (!supportsShadowDom || !cmpMeta.scopedCssEncapsulation)) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        elm['s-cr'] = document.createTextNode('') as any;
        elm['s-cr']['s-cn'] = true;
        elm.insertBefore(elm['s-cr'], elm.firstChild);
      }

      if ((BUILD.es5 || BUILD.scoped) && !supportsShadowDom && cmpMeta.scopedCssEncapsulation) {
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
      try {
        const LazyCstr = await loadModuleImport(elm, (cmpMeta as d.ComponentLazyRuntimeMeta).lazyBundleIds);

        if (BUILD.member && !LazyCstr.isProxied && cmpMeta.members) {
          // we'eve never proxied this Constructor before
          // let's add the getters/setters to its prototype
          proxyComponent(LazyCstr.prototype, cmpMeta, true);
          LazyCstr.isProxied = true;
        }

        // ok, time to construct the instance
        // but let's keep track of when we start and stop
        // so that the getters/setters don't incorrectly step on data
        BUILD.member && (elmData.isConstructingInstance = true);
        new (LazyCstr as any)(elmData);
        BUILD.member && (elmData.isConstructingInstance = false);

      } catch (e) {
        consoleError(e);
      }
    }

    if (BUILD.member && cmpMeta.members) {
      // initUpdate BUILD.member
      cmpMeta.members.forEach(member => {
        if (member[3] && elm.hasAttribute(member[3] as any)) {
          elmData.instanceValues.set(member[0], elm.getAttribute(member[3] as any));
        }
      });
    }

    if (BUILD.taskQueue) {
      writeTask(() => update(elm, elmData.instance, elmData, cmpMeta, true));
    } else {
      update(elm, elmData.instance, elmData, cmpMeta, true);
    }
  }
};
