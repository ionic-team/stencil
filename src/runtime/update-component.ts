import * as d from '../declarations';
import { attachStyles } from './styles';
import { BUILD, NAMESPACE } from '@build-conditionals';
import { CMP_FLAGS, HOST_FLAGS } from '@utils';
import { consoleError, doc, getHostRef, nextTick, plt, writeTask } from '@platform';
import { HYDRATED_CLASS, PLATFORM_FLAGS } from './runtime-constants';
import { renderVdom } from './vdom/vdom-render';
import { createTime } from './profile';

export const attachToAncestor = (hostRef: d.HostRef, ancestorComponent: d.HostElement) =>  {
  if (BUILD.asyncLoading && ancestorComponent && !hostRef.$onRenderResolve$) {
    ancestorComponent['s-p'].push(new Promise(r => hostRef.$onRenderResolve$ = r));
  }
};

export const scheduleUpdate = (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad: boolean) => {
  if (BUILD.taskQueue && BUILD.updatable) {
    hostRef.$flags$ |= HOST_FLAGS.isQueuedForUpdate;
  }
  if (BUILD.asyncLoading && hostRef.$flags$ & HOST_FLAGS.isWaitingForChildren) {
    hostRef.$flags$ |= HOST_FLAGS.needsRerender;
    return;
  }
  const endSchedule = createTime('scheduleUpdate', cmpMeta.$tagName$);
  const ancestorComponent = hostRef.$ancestorComponent$;
  const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm as any;
  const update = () => updateComponent(elm, hostRef, cmpMeta, instance, isInitialLoad);
  const rc = elm['s-rc'];
  attachToAncestor(hostRef, ancestorComponent);

  let promise: Promise<void>;
  if (isInitialLoad) {
    if (BUILD.lazyLoad && BUILD.hostListener) {
      hostRef.$flags$ |= HOST_FLAGS.isListenReady;
      if (hostRef.$queuedListeners$) {
        hostRef.$queuedListeners$.forEach(([methodName, event]) => safeCall(instance, methodName, event));
        hostRef.$queuedListeners$ = null;
      }
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

  if (BUILD.asyncLoading && rc) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    rc.forEach(cb => cb());
    elm['s-rc'] = undefined;
  }

  endSchedule();

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
  const endUpdate = createTime('update', cmpMeta.$tagName$);
  if (BUILD.style && isInitialLoad) {
    // DOM WRITE!
    attachStyles(elm, cmpMeta, hostRef.$modeName$);
  }

  const endRender = createTime('render', cmpMeta.$tagName$);
  if (BUILD.isDev)  {
    hostRef.$flags$ |= HOST_FLAGS.devOnRender;
  }

  if (BUILD.hasRenderFn || BUILD.reflect) {
    if (BUILD.vdomRender || BUILD.reflect) {
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
    } else {
      elm.textContent = (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render());
    }
  }
  if (BUILD.cssVarShim && plt.$cssShim$) {
    plt.$cssShim$.updateHost(elm);
  }
  if (BUILD.isDev) {
    hostRef.$renderCount$++;
    hostRef.$flags$ &= ~HOST_FLAGS.devOnRender;
  }
  if (BUILD.updatable && BUILD.taskQueue) {
    hostRef.$flags$ &= ~HOST_FLAGS.isQueuedForUpdate;
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

  if (BUILD.updatable || BUILD.lazyLoad) {
    hostRef.$flags$ |= HOST_FLAGS.hasRendered;
  }
  endRender();
  endUpdate();

  if (BUILD.asyncLoading) {
    const childrenPromises = elm['s-p'];
    const postUpdate = () => postUpdateComponent(elm, hostRef, cmpMeta);
    if (childrenPromises.length === 0) {
      postUpdate();
    } else {
      Promise.all(childrenPromises).then(postUpdate);
      hostRef.$flags$ |= HOST_FLAGS.isWaitingForChildren;
      childrenPromises.length = 0;
    }
  } else {
    postUpdateComponent(elm, hostRef, cmpMeta);
  }
};


export const postUpdateComponent = (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta) => {
  const endPostUpdate = createTime('postUpdate', cmpMeta.$tagName$);
  const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm as any;
  const ancestorComponent = hostRef.$ancestorComponent$;

  if (BUILD.cmpDidRender) {
    if (BUILD.isDev) {
      hostRef.$flags$ |= HOST_FLAGS.devOnRender;
    }
    safeCall(instance, 'componentDidRender');
    if (BUILD.isDev) {
      hostRef.$flags$ &= ~HOST_FLAGS.devOnRender;
    }
  }
  emitLifecycleEvent(elm, 'componentDidRender');

  if (!(hostRef.$flags$ & HOST_FLAGS.hasLoadedComponent)) {
    hostRef.$flags$ |= HOST_FLAGS.hasLoadedComponent;

    if (BUILD.asyncLoading && BUILD.cssAnnotations) {
      // DOM WRITE!
      // add the css class that this element has officially hydrated
      elm.classList.add(HYDRATED_CLASS);
    }

    if (BUILD.cmpDidLoad) {
      if (BUILD.isDev)  {
        hostRef.$flags$ |= HOST_FLAGS.devOnDidLoad;
      }
      safeCall(instance, 'componentDidLoad');
      if (BUILD.isDev)  {
        hostRef.$flags$ &= ~HOST_FLAGS.devOnDidLoad;
      }
    }

    emitLifecycleEvent(elm, 'componentDidLoad');
    endPostUpdate();

    if (BUILD.asyncLoading) {
      hostRef.$onReadyResolve$(elm);
      if (!ancestorComponent)  {
        appDidLoad(cmpMeta.$tagName$);
      }
    }

  } else {
    if (BUILD.cmpDidUpdate) {
      // we've already loaded this component
      // fire off the user's componentDidUpdate method (if one was provided)
      // componentDidUpdate runs AFTER render() has been called
      // and all child components have finished updating
      if (BUILD.isDev)  {
        hostRef.$flags$ |= HOST_FLAGS.devOnRender;
      }
      safeCall(instance, 'componentDidUpdate');
      if (BUILD.isDev) {
        hostRef.$flags$ &= ~HOST_FLAGS.devOnRender;
      }
    }
    emitLifecycleEvent(elm, 'componentDidUpdate');
    endPostUpdate();
  }

  if (BUILD.hotModuleReplacement) {
    elm['s-hmr-load'] && elm['s-hmr-load']();
  }

  if (BUILD.method && BUILD.lazyLoad) {
    hostRef.$onInstanceResolve$(elm);
  }
  // load events fire from bottom to top
  // the deepest elements load first then bubbles up
  if (BUILD.asyncLoading) {
    if (hostRef.$onRenderResolve$) {
      hostRef.$onRenderResolve$();
      hostRef.$onRenderResolve$ = undefined;
    }
    if (hostRef.$flags$ & HOST_FLAGS.needsRerender) {
      nextTick(() => scheduleUpdate(elm, hostRef, cmpMeta, false));
    }
    hostRef.$flags$ &= ~(HOST_FLAGS.isWaitingForChildren | HOST_FLAGS.needsRerender);
  }
  // ( •_•)
  // ( •_•)>⌐■-■
  // (⌐■_■)
};

export const forceUpdate = (elm: d.RenderNode, cmpMeta: d.ComponentRuntimeMeta) => {
  if (BUILD.updatable) {
    const hostRef = getHostRef(elm);
    if ((hostRef.$flags$ & (HOST_FLAGS.hasRendered | HOST_FLAGS.isQueuedForUpdate)) === HOST_FLAGS.hasRendered) {
      scheduleUpdate(
        elm,
        hostRef,
        cmpMeta,
        false
      );
    }
  }
};

export const appDidLoad = (who: string) => {
  // on appload
  // we have finish the first big initial render
  if (BUILD.cssAnnotations) {
    doc.documentElement.classList.add(HYDRATED_CLASS);
  }
  if (!BUILD.hydrateServerSide) {
    plt.$flags$ |= PLATFORM_FLAGS.appLoaded;
  }
  emitLifecycleEvent(doc, 'appload');
  if (BUILD.profile) {
    performance.measure(`[Stencil] ${NAMESPACE} initial load (by ${who})`, 'st:app:start');
  }
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
