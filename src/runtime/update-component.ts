import * as d from '../declarations';
import { attachStyles } from './styles';
import { BUILD } from '@build-conditionals';
import { consoleError, cssVarShim, doc, plt, writeTask } from '@platform';
import { HOST_FLAGS } from '@utils';
import { HYDRATED_CLASS, PLATFORM_FLAGS } from './runtime-constants';
import { renderVdom } from './vdom/vdom-render';


export const safeCall = (instance: any, method: string) => {
  if (instance && instance[method]) {
    try {
      return instance[method]();
    } catch (e) {
      consoleError(e);
    }
  }
  return undefined;
};

export const scheduleUpdate = async (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean) => {
  if (BUILD.taskQueue && BUILD.updatable) {
    hostRef.$flags$ |= HOST_FLAGS.isQueuedForUpdate;
  }
  const instance = (BUILD.lazyLoad || BUILD.hydrateServerSide) ? hostRef.$lazyInstance$ : elm as any;
  if (isInitialLoad) {
    emitLifecycleEvent(elm, 'componentWillLoad');
    if (BUILD.cmpWillLoad) {
      await safeCall(instance, 'componentWillLoad');
    }

  } else {
    emitLifecycleEvent(elm, 'componentWillUpdate');

    if (BUILD.cmpWillUpdate) {
      await safeCall(instance, 'componentWillUpdate');
    }
  }

  emitLifecycleEvent(elm, 'componentWillRender');
  if (BUILD.cmpWillRender) {
    await safeCall(instance, 'componentWillRender');
  }

  // there is no ancestorc omponent or the ancestor component
  // has already fired off its lifecycle update then
  // fire off the initial update
  if (BUILD.taskQueue) {
    writeTask(() => updateComponent(elm, hostRef, cmpMeta, isInitialLoad, instance));
  } else {
    // syncronuously write DOM
    updateComponent(elm, hostRef, cmpMeta, isInitialLoad, instance);
  }
};

const updateComponent = (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean, instance: any) => {
  // updateComponent
  if (BUILD.updatable && BUILD.taskQueue) {
    hostRef.$flags$ &= ~HOST_FLAGS.isQueuedForUpdate;
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
      hostRef.$flags$ |= HOST_FLAGS.isActiveRender;

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
      hostRef.$flags$ &= ~HOST_FLAGS.isActiveRender;
    } else {
      elm.textContent = (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render());
    }
  }
  if (cssVarShim) {
    cssVarShim.updateHost(elm);
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
    hostRef.$flags$ |= HOST_FLAGS.hasRendered;
  }

  if (BUILD.lifecycle && elm['s-rc'].length > 0) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm['s-rc'].forEach(cb => cb());
    elm['s-rc'].length = 0;
  }

  postUpdateComponent(elm, hostRef);
};


export const postUpdateComponent = (elm: d.HostElement, hostRef: d.HostRef, ancestorsActivelyLoadingChildren?: Set<d.HostElement>) => {
  if ((BUILD.lazyLoad || BUILD.hydrateServerSide || BUILD.lifecycle || BUILD.lifecycleDOMEvents) && !elm['s-al']) {
    const instance = (BUILD.lazyLoad || BUILD.hydrateServerSide) ? hostRef.$lazyInstance$ : elm as any;
    const ancestorComponent = hostRef.$ancestorComponent$;

    if (BUILD.cmpDidRender) {
      safeCall(instance, 'componentDidRender');
    }
    emitLifecycleEvent(elm, 'componentDidRender');

    if (!(hostRef.$flags$ & HOST_FLAGS.hasLoadedComponent)) {
      hostRef.$flags$ |= HOST_FLAGS.hasLoadedComponent;

      if ((BUILD.lazyLoad || BUILD.hydrateServerSide) && BUILD.style) {
        // DOM WRITE!
        // add the css class that this element has officially hydrated
        elm.classList.add(HYDRATED_CLASS);
      }

      if (BUILD.cmpDidLoad) {
        safeCall(instance, 'componentDidLoad');
      }

      emitLifecycleEvent(elm, 'componentDidLoad');

      if (BUILD.lazyLoad || BUILD.hydrateServerSide) {
        hostRef.$onReadyResolve$(elm);
      }

      if (!ancestorComponent) {
        // on appload
        // we have finish the first big initial render
        doc.documentElement.classList.add(HYDRATED_CLASS);

        if (!BUILD.hydrateServerSide) {
          setTimeout(() => plt.$flags$ |= PLATFORM_FLAGS.queueAsync, 999);
        }

        emitLifecycleEvent(elm, 'appload');
      }

    } else {
      if (BUILD.cmpDidUpdate) {
        // we've already loaded this component
        // fire off the user's componentDidUpdate method (if one was provided)
        // componentDidUpdate runs AFTER render() has been called
        // and all child components have finished updating
        safeCall(instance, 'componentDidUpdate');
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
