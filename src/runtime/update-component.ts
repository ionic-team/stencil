import * as d from '../declarations';
import { attachStyles } from './styles';
import { BUILD } from '@build-conditionals';
import { CMP_FLAGS, HOST_FLAGS } from '@utils';
import { consoleError, cssVarShim, doc, getHostRef, plt, writeTask } from '@platform';
import { HYDRATED_CLASS, PLATFORM_FLAGS } from './runtime-constants';
import { renderVdom } from './vdom/vdom-render';

export const scheduleUpdate = (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean) => {
  if (BUILD.taskQueue && BUILD.updatable) {
    hostRef.$flags$ |= HOST_FLAGS.isQueuedForUpdate;
  }

  const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm as any;
  const update = () => updateComponent(elm, hostRef, cmpMeta, instance, isInitialLoad);

  let promise: Promise<void>;
  if (isInitialLoad) {
    if (BUILD.hostListener) {
      hostRef.$flags$ |= HOST_FLAGS.isListenReady;
    }
    if (BUILD.hostListener && hostRef.$queuedListeners$) {
      hostRef.$queuedListeners$.forEach(([methodName, event]) => safeCall(instance, methodName, event));
      hostRef.$queuedListeners$ = null;
    }
    emitLifecycleEvent(elm, 'componentWillLoad');
    if (BUILD.cmpWillLoad) {
      promise = safeCall(instance, 'componentWillLoad');
    }

  } else {
    emitLifecycleEvent(elm, 'componentWillUpdate');

    if (BUILD.cmpWillUpdate) {
      promise = safeCall(instance, 'componentWillUpdate');
    }
  }

  emitLifecycleEvent(elm, 'componentWillRender');
  if (BUILD.cmpWillRender) {
    promise = then(promise, () => safeCall(instance, 'componentWillRender'));
  }

  // there is no ancestorc omponent or the ancestor component
  // has already fired off its lifecycle update then
  // fire off the initial update
  return then(promise, BUILD.taskQueue
    ? () => writeTask(update)
    : update
  );
};

const updateComponent = (elm: d.RenderNode, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, instance: any, isInitialLoad: boolean) => {
  // updateComponent
  if (BUILD.updatable && BUILD.taskQueue) {
    hostRef.$flags$ &= ~HOST_FLAGS.isQueuedForUpdate;
  }

  if (BUILD.lifecycle && BUILD.lazyLoad) {
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

      if (isInitialLoad && (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation)) {
        // using only during server-side hydrate
        elm['s-sd'] = true;
      }

    } catch (e) {
      consoleError(e);
    }
  }

  // set that this component lifecycle rendering has completed
  if (BUILD.lifecycle && BUILD.lazyLoad) {
    elm['s-lr'] = true;
  }
  if (BUILD.updatable || BUILD.lazyLoad) {
    hostRef.$flags$ |= HOST_FLAGS.hasRendered;
  }

  if (BUILD.lifecycle && BUILD.lazyLoad && elm['s-rc'].length > 0) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm['s-rc'].forEach(cb => cb());
    elm['s-rc'].length = 0;
  }

  postUpdateComponent(elm, hostRef);
};


export const postUpdateComponent = (elm: d.HostElement, hostRef: d.HostRef, ancestorsActivelyLoadingChildren?: Set<d.HostElement>) => {
  if ((BUILD.lazyLoad || BUILD.lifecycle || BUILD.lifecycleDOMEvents) && !elm['s-al']) {
    const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm as any;
    const ancestorComponent = hostRef.$ancestorComponent$;

    if (BUILD.cmpDidRender) {
      safeCall(instance, 'componentDidRender');
    }
    emitLifecycleEvent(elm, 'componentDidRender');

    if (!(hostRef.$flags$ & HOST_FLAGS.hasLoadedComponent)) {
      hostRef.$flags$ |= HOST_FLAGS.hasLoadedComponent;

      if (BUILD.lazyLoad && BUILD.cssAnnotations) {
        // DOM WRITE!
        // add the css class that this element has officially hydrated
        elm.classList.add(HYDRATED_CLASS);
      }

      if (BUILD.cmpDidLoad) {
        safeCall(instance, 'componentDidLoad');
      }

      emitLifecycleEvent(elm, 'componentDidLoad');

      if (BUILD.lazyLoad) {
        hostRef.$onReadyResolve$(elm);
      }

      if (BUILD.lazyLoad && !ancestorComponent) {
        appDidLoad();
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
    if (BUILD.lifecycle && BUILD.lazyLoad && ancestorComponent) {
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

export const forceUpdate = (elm: d.RenderNode, cmpMeta: d.ComponentRuntimeMeta) => {
  if (BUILD.updatable) {
    const hostRef = getHostRef(elm);
    if (hostRef.$flags$ & HOST_FLAGS.hasRendered) {
      scheduleUpdate(
        elm,
        hostRef,
        cmpMeta,
        false
      );
    }
  }
};

export const appDidLoad = () => {
  // on appload
  // we have finish the first big initial render
  if (BUILD.cssAnnotations) {
    doc.documentElement.classList.add(HYDRATED_CLASS);
  }
  if (!BUILD.hydrateServerSide) {
    plt.$flags$ |= PLATFORM_FLAGS.appLoaded;
  }
  emitLifecycleEvent(doc, 'appload');
};

export const safeCall = (instance: any, method: string, arg?: any) => {
  if (instance && instance[method]) {
    try {
      return instance[method](arg);
    } catch (e) {
      consoleError(e);
    }
  }
  return undefined;
};

const then = (promise: Promise<any>, thenFn: () => any) => {
  return promise && promise.then ? promise.then(thenFn) : thenFn();
};

const emitLifecycleEvent = (elm: EventTarget, lifecycleName: string) => {
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
