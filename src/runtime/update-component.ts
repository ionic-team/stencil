import * as d from '@declarations';
import { attachStyles, getElementScopeId } from './styles';
import { BUILD } from '@build-conditionals';
import { DEFAULT_STYLE_MODE, HOST_STATE, toLowerCase } from '@utils';
import { consoleError, plt } from '@platform';
import { renderVdom } from './vdom/render';


export const updateComponent = async (elm: d.HostElement, instance: any, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialUpdate?: boolean) => {
  // update
  if (BUILD.updatable) {
    hostRef.flags &= ~HOST_STATE.isQueuedForUpdate;
  }

  try {
    if (isInitialUpdate) {
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

  if (isInitialUpdate) {
    if (BUILD.slotRelocation) {
      // initUpdate, BUILD.slotPolyfill
      // if the slot polyfill is required we'll need to put some nodes
      // in here to act as original content anchors as we move nodes around
      // host element has been connected to the DOM
      if ((BUILD.shadowDom && !plt.supportsShadowDom && cmpMeta.cmpShadowDomEncapsulation) || (BUILD.scoped && cmpMeta.cmpScopedCssEncapsulation)) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!

        if (BUILD.mode) {
          elm['s-sc'] = ('sc-' + toLowerCase(elm.tagName)) + ((elm.mode !== DEFAULT_STYLE_MODE) ? '-' + elm.mode : '');
        } else {
          elm['s-sc'] = 'sc-' + toLowerCase(elm.tagName);
        }

        elm.classList.add(getElementScopeId(elm['s-sc'], true));

        if (cmpMeta.cmpScopedCssEncapsulation) {
          elm.classList.add(getElementScopeId(elm['s-sc']));
        }
      }
    }

    if (BUILD.shadowDom && plt.supportsShadowDom && cmpMeta.cmpShadowDomEncapsulation) {
      // DOM WRITE
      // this component is using shadow dom
      // and this browser supports shadow dom
      // add the read-only property "shadowRoot" to the host element
      elm.attachShadow({ 'mode': 'open' });
    }

    if (BUILD.style) {
      // DOM WRITE!
      attachStyles(elm);
    }
  }

  if (BUILD.hasRenderFn || BUILD.reflect) {
    try {
      // tell the platform we're actively rendering
      // if a value is changed within a render() then
      // this tells the platform not to queue the change
      if (BUILD.updatable) {
        hostRef.flags |= HOST_STATE.isActiveRender;
      }

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

  elm['s-rn'] = true;
  hostRef.flags |= HOST_STATE.hasRendered;

  if (BUILD.lifecycle && elm['s-rc']) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm['s-rc'].forEach(cb => cb());
    elm['s-rc'] = undefined;
  }

  postUpdateComponent(elm, instance, hostRef, isInitialUpdate);
};


export const postUpdateComponent = (elm: d.HostElement, instance: any, hostRef: d.HostRef, isInitialUpdate: boolean, ancestorsActivelyLoadingChildren?: Set<d.HostElement>) => {
  if (!elm[ACTIVELY_LOADING]) {
    hostRef.hasPostUpdatedComponent = true;

    try {
      if (isInitialUpdate) {
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

    if (BUILD.lazyLoad && isInitialUpdate) {
      // DOM WRITE!
      // add the css class that this element has officially hydrated
      elm.classList.add('hydrated');

      // fire off the user's elm.componentOnReady() resolve (if any)
      hostRef.onReadyResolve && hostRef.onReadyResolve(elm);

      if (BUILD.lifecycleDOMEvents && hostRef.isRootComponent) {
        emitLifecycleEvent(elm, 'appload');
      }
    }

    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    if (BUILD.lifecycle && hostRef.ancestorHostElement) {
      // ok so this element already has a known ancestor host element
      // let's make sure we remove this element from its ancestor's
      // known list of child elements which are actively loading
      ancestorsActivelyLoadingChildren = hostRef.ancestorHostElement[ACTIVELY_LOADING];

      if (ancestorsActivelyLoadingChildren) {
        // remove this element from the actively loading map
        ancestorsActivelyLoadingChildren.delete(elm);

        // the ancestor's initializeComponent method will do the actual checks
        // to see if the ancestor is actually loaded or not
        // then let's call the ancestor's initializeComponent method if there's no length
        // (which actually ends up as this method again but for the ancestor)
        if (!ancestorsActivelyLoadingChildren.size) {
          hostRef.ancestorHostElement[ACTIVELY_LOADING] = undefined;
          hostRef.ancestorHostElement['s-init']();
        }
      }

      hostRef.ancestorHostElement = undefined;
    }

    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
  }
};


const ACTIVELY_LOADING = 's-al';


const emitLifecycleEvent = (elm: d.HostElement, lifecycleName: string) => {
  if (BUILD.lifecycleDOMEvents) {
    elm.dispatchEvent(new CustomEvent('stencil_' + lifecycleName, { 'bubbles': true, 'composed': true }));
  }
};
