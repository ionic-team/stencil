import * as d from '@declarations';
import { attachStyles, getElementScopeId } from './styles';
import { BUILD } from '@build-conditionals';
import { consoleError, plt, writeTask } from '@platform';
import { CMP_FLAG, HOST_STATE } from '@utils';
import { renderVdom } from './vdom/render';

export const scheduleUpdate = async (elm: d.HostElement, instance: any, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean) => {
  try {
    if (isInitialLoad) {
      emitLifecycleEvent(elm, 'componentWillLoad');
      if (BUILD.cmpWillLoad && instance.componentWillLoad) {
        await instance.componentWillLoad();
      }

    } else {
      emitLifecycleEvent(elm, 'componentWillUpdate');

      if (BUILD.cmpWillUpdate && instance.componentWillUpdate) {
        await instance.componentWillUpdate();
      }
    }

    emitLifecycleEvent(elm, 'componentWillRender');
    if (BUILD.cmpWillRender && instance.componentWillRender) {
      await instance.componentWillRender();
    }

  } catch (e) {
    consoleError(e);
  }
  // there is no ancestorc omponent or the ancestor component
  // has already fired off its lifecycle update then
  // fire off the initial update
  if (BUILD.taskQueue) {
    // LIFECYCHE
    if (BUILD.updatable) {
      hostRef.flags |= HOST_STATE.isQueuedForUpdate;
    }
    writeTask(() => updateComponent(elm, (BUILD.lazyLoad ? hostRef.lazyInstance : elm as any), hostRef, cmpMeta, true));
  } else {
    // syncronuously write DOM
    updateComponent(elm, (BUILD.lazyLoad ? hostRef.lazyInstance : elm as any), hostRef, cmpMeta, true);
  }
};

const updateComponent = (elm: d.HostElement, instance: any, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean) => {
  // updateComponent
  if (BUILD.updatable && BUILD.taskQueue) {
    hostRef.flags &= ~HOST_STATE.isQueuedForUpdate;
  }

  elm['s-lr'] = false;

  if (isInitialLoad) {
    if ((BUILD.shadowDom && !plt.supportsShadowDom && cmpMeta.cmpFlags & CMP_FLAG.shadowDomEncapsulation) || (BUILD.scoped && cmpMeta.cmpFlags & CMP_FLAG.scopedCssEncapsulation)) {
      // only required when we're NOT using native shadow dom (slot)
      // or this browser doesn't support native shadow dom
      // and this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      // create a node to represent where the original
      // content was first placed, which is useful later on
      // DOM WRITE!!
      const scopeId = elm['s-sc'] = (BUILD.mode)
        ? 'sc-' + cmpMeta.cmpTag + (hostRef.modeName ? '-' + hostRef.modeName : '')
        : 'sc-' + cmpMeta.cmpTag;

      elm.classList.add(getElementScopeId(scopeId, true));

      if (cmpMeta.cmpFlags & CMP_FLAG.scopedCssEncapsulation) {
        elm.classList.add(getElementScopeId(scopeId, false));
      }
    }
    if (BUILD.style) {
      // DOM WRITE!
      attachStyles(elm, cmpMeta, hostRef.modeName);
    }
  }

  if (BUILD.hasRenderFn || BUILD.reflect) {
    try {
      // tell the platform we're actively rendering
      // if a value is changed within a render() then
      // this tells the platform not to queue the change
      hostRef.flags |= HOST_STATE.isActiveRender;

      // looks like we've got child nodes to render into this host element
      // or we need to update the css class/attrs on the host element
      if (BUILD.vdomRender || BUILD.reflect) {
        // DOM WRITE!
        renderVdom(
          elm,
          hostRef,
          cmpMeta,
          (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render()),
        );
      }

    } catch (e) {
      consoleError(e);
    }

    if (BUILD.updatable) {
      // tell the platform we're done rendering
      // now any changes will again queue
      hostRef.flags &= ~HOST_STATE.isActiveRender;
    }
  }

  // set that this component lifecycle rendering has completed
  elm['s-lr'] = true;
  hostRef.flags |= HOST_STATE.hasRendered;

  if (BUILD.lifecycle && elm['s-rc']) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm['s-rc'].forEach(cb => cb());
    elm['s-rc'] = undefined;
  }

  postUpdateComponent(elm, instance, hostRef);
};


export const postUpdateComponent = (elm: d.HostElement, instance: any, hostRef: d.HostRef, ancestorsActivelyLoadingChildren?: Set<d.HostElement>) => {
  if (!elm['s-al']) {

    try {
      if (!(hostRef.flags & HOST_STATE.hasLoadedComponent)) {
        if (BUILD.cmpDidLoad && instance.componentDidLoad) {
          instance.componentDidLoad();
        }
        emitLifecycleEvent(elm, 'componentDidLoad');

      } else {
        if (BUILD.cmpDidUpdate && instance.componentDidUpdate) {
          // we've already loaded this component
          // fire off the user's componentDidUpdate method (if one was provided)
          // componentDidUpdate runs AFTER render() has been called
          // and all child components have finished updating
          instance.componentDidUpdate();
        }
        emitLifecycleEvent(elm, 'componentDidUpdate');
      }

      if (BUILD.cmpDidRender && instance.componentDidRender) {
        instance.componentDidRender();
      }
      emitLifecycleEvent(elm, 'componentDidRender');

    } catch (e) {
      consoleError(e);
    }

    if (BUILD.hotModuleReplacement) {
      elm['s-hmr-load'] && elm['s-hmr-load']();
    }

    if (BUILD.lazyLoad && !(hostRef.flags & HOST_STATE.hasLoadedComponent)) {
      if (BUILD.style) {
        // DOM WRITE!
        // add the css class that this element has officially hydrated
        elm.classList.add('hydrated');
      }

      // fire off the user's elm.componentOnReady() resolve (if any)
      hostRef.onReadyResolve && hostRef.onReadyResolve(elm);

      if (BUILD.lifecycleDOMEvents && !hostRef.ancestorComponent) {
        emitLifecycleEvent(elm, 'appload');
      }
    }
    hostRef.flags |= HOST_STATE.hasLoadedComponent;

    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    if (BUILD.lifecycle && hostRef.ancestorComponent) {
      // ok so this element already has a known ancestor component
      // let's make sure we remove this element from its ancestor's
      // known list of child elements which are actively loading
      ancestorsActivelyLoadingChildren = hostRef.ancestorComponent['s-al'];

      if (ancestorsActivelyLoadingChildren) {
        // remove this element from the actively loading map
        ancestorsActivelyLoadingChildren.delete(elm);

        // the ancestor's initializeComponent method will do the actual checks
        // to see if the ancestor is actually loaded or not
        // then let's call the ancestor's initializeComponent method if there's no length
        // (which actually ends up as this method again but for the ancestor)
        if (!ancestorsActivelyLoadingChildren.size) {
          hostRef.ancestorComponent['s-al'] = undefined;
          hostRef.ancestorComponent['s-init']();
        }
      }

      hostRef.ancestorComponent = undefined;
    }

    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
  }
};


const emitLifecycleEvent = (elm: d.HostElement, lifecycleName: string) => {
  if (BUILD.lifecycleDOMEvents) {
    elm.dispatchEvent(new CustomEvent('stencil_' + lifecycleName, { 'bubbles': true, 'composed': true }));
  }
};
