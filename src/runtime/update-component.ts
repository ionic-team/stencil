import * as d from '../declarations';
import { attachStyles } from './styles';
import { BUILD } from '@build-conditionals';
import { consoleError, doc, plt, writeTask } from '@platform';
import { HOST_STATE } from '@utils';
import { HYDRATED_CLASS } from './runtime-constants';
import { renderVdom } from './vdom/vdom-render';


export const scheduleUpdate = async (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean) => {
  if (BUILD.taskQueue && BUILD.updatable) {
    hostRef.$stateFlags$ |= HOST_STATE.isQueuedForUpdate;
  }
  const instance = (BUILD.lazyLoad || BUILD.hydrateServerSide) ? hostRef.$lazyInstance$ : elm as any;
  try {
    if (isInitialLoad) {
      emitLifecycleEvent(elm, 'componentWillLoad');
      if (BUILD.cmpWillLoad &&  instance.componentWillLoad) {
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
    writeTask(() => updateComponent(elm, hostRef, cmpMeta, true, instance));
  } else {
    // syncronuously write DOM
    updateComponent(elm, hostRef, cmpMeta, true, instance);
  }
};

const updateComponent = (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean, instance: any) => {
  // updateComponent
  if (BUILD.updatable && BUILD.taskQueue) {
    hostRef.$stateFlags$ &= ~HOST_STATE.isQueuedForUpdate;
  }

  if (BUILD.lifecycle) {
    elm['s-lr'] = false;
  }

  if (BUILD.style && isInitialLoad) {
    // DOM WRITE!
    attachStyles(elm, cmpMeta, hostRef.$modeName$);
  }

  if (BUILD.hasRenderFn || BUILD.reflect) {
    if (BUILD.vdomRender || BUILD.reflect) {
      // tell the platform we're actively rendering
      // if a value is changed within a render() then
      // this tells the platform not to queue the change
      hostRef.$stateFlags$ |= HOST_STATE.isActiveRender;

      try {
        // looks like we've got child nodes to render into this host element
        // or we need to update the css class/attrs on the host element
        // DOM WRITE!
        renderVdom(
          elm,
          hostRef,
          cmpMeta,
          (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render()),
        );
      } catch (e) {
        consoleError(e);
      }
      hostRef.$stateFlags$ &= ~HOST_STATE.isActiveRender;
    } else {
      elm.textContent = (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render());
    }
  }

  if (BUILD.hydrateServerSide) {
    try {
      // manually connected child components during server-side hydrate
      serverSideConnected(elm);

    } catch (e) {
      consoleError(e);
    }
  }

  // set that this component lifecycle rendering has completed
  if (BUILD.lifecycle) {
    elm['s-lr'] = true;
  }
  if (BUILD.updatable || BUILD.lazyLoad || BUILD.hydrateServerSide) {
    hostRef.$stateFlags$ |= HOST_STATE.hasRendered;
  }

  if (BUILD.lifecycle && elm['s-rc'] !== undefined) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm['s-rc'].forEach(cb => cb());
    elm['s-rc'] = undefined;
  }

  postUpdateComponent(elm, hostRef);
};


export const postUpdateComponent = (elm: d.HostElement, hostRef: d.HostRef, ancestorsActivelyLoadingChildren?: Set<d.HostElement>) => {
  if ((BUILD.lazyLoad || BUILD.hydrateServerSide || BUILD.lifecycle || BUILD.lifecycleDOMEvents) && !elm['s-al']) {
    const instance = (BUILD.lazyLoad || BUILD.hydrateServerSide) ? hostRef.$lazyInstance$ : elm as any;
    const ancestorComponent = hostRef.$ancestorComponent$;

    if (BUILD.cmpDidRender && instance.componentDidRender) {
      instance.componentDidRender();
    }
    emitLifecycleEvent(elm, 'componentDidRender');

    if (!(hostRef.$stateFlags$ & HOST_STATE.hasLoadedComponent)) {
      hostRef.$stateFlags$ |= HOST_STATE.hasLoadedComponent;

      if ((BUILD.lazyLoad || BUILD.hydrateServerSide) && BUILD.style) {
        // DOM WRITE!
        // add the css class that this element has officially hydrated
        elm.classList.add(HYDRATED_CLASS);
      }

      if (BUILD.cmpDidLoad && instance.componentDidLoad) {
        instance.componentDidLoad();
      }

      emitLifecycleEvent(elm, 'componentDidLoad');

      if (BUILD.lazyLoad || BUILD.hydrateServerSide) {
        hostRef.$onReadyResolve$(elm);
      }

      if (!ancestorComponent) {
        // on appload
        // we have finish the first big initial render
        doc.documentElement.classList.add(HYDRATED_CLASS);
        setTimeout(() => plt.$queueAsync$ = true, 999);
        emitLifecycleEvent(elm, 'appload');
      }

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

    if (BUILD.hotModuleReplacement) {
      elm['s-hmr-load'] && elm['s-hmr-load']();
    }

    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    if (BUILD.lifecycle && ancestorComponent) {
      // ok so this element already has a known ancestor component
      // let's make sure we remove this element from its ancestor's
      // known list of child elements which are actively loading
      if (ancestorsActivelyLoadingChildren = ancestorComponent['s-al']) {
        // remove this element from the actively loading map
        ancestorsActivelyLoadingChildren.delete(elm);

        // the ancestor's initializeComponent method will do the actual checks
        // to see if the ancestor is actually loaded or not
        // then let's call the ancestor's initializeComponent method if there's no length
        // (which actually ends up as this method again but for the ancestor)
        if (ancestorsActivelyLoadingChildren.size === 0) {
          ancestorComponent['s-al'] = undefined;
          ancestorComponent['s-init']();
        }
      }

      hostRef.$ancestorComponent$ = undefined;
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


const serverSideConnected = (elm: any) => {
  const children = elm.children;
  if (children != null) {
    for (let i = 0, ii = children.length; i < ii; i++) {
      const childElm = children[i] as any;
      if (typeof childElm.connectedCallback === 'function') {
        childElm.connectedCallback();
      }
      serverSideConnected(childElm);
    }
  }
};
