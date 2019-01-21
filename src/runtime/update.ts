import * as d from '@declarations';
import { activelyProcessingCmps, consoleError, onAppReadyCallbacks, plt } from '@platform';
import { attachStyles } from './styles';
import { BUILD } from '@build-conditionals';
import { renderVdom } from './vdom/render';


export const update = async (elm: d.HostElement, instance: any, elmData: d.ElementData, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad?: boolean, ancestorsActivelyLoadingChildren?: Set<d.HostElement>) => {
  // update
  if (BUILD.taskQueue) {
    elmData.isQueuedForUpdate = false;
  }

  if (BUILD.exposeAppOnReady) {
    activelyProcessingCmps.add(elm);
  }

  try {
    if (isInitialLoad) {
      if (BUILD.cmpWillLoad && instance.componentWillLoad) {
        await instance.componentWillLoad();
      }

    } else if (BUILD.cmpWillUpdate && instance.componentWillUpdate) {
      await instance.componentWillUpdate();
    }
  } catch (e) {
    consoleError(e);
  }

  if (BUILD.shadowDom && isInitialLoad && plt.supportsShadowDom && cmpMeta.shadowDomEncapsulation) {
    // DOM WRITE
    // this component is using shadow dom
    // and this browser supports shadow dom
    // add the read-only property "shadowRoot" to the host element
    elm.attachShadow({ mode: 'open' });
  }

  if (BUILD.hasRenderFn) {
    // tell the platform we're actively rendering
    // if a value is changed within a render() then
    // this tells the platform not to queue the change
    if (BUILD.updatable) {
      elmData.isActiveRender = true;
    }

    try {
      // let reflectHostAttr: d.VNodeData;
      if (BUILD.reflectToAttr) {
        // reflectHostAttr = reflectInstanceValuesToHostAttributes(cmpCstr.properties, elmData.instance);
      }

      if ((BUILD.hasRenderFn || BUILD.hostData || BUILD.reflectToAttr)) {
        // tell the platform we're actively rendering
        // if a value is changed within a render() then
        // this tells the platform not to queue the change
        // if (BUILD.updatable) {
        //   plt.isActiveRender = true;
        // }

        if (BUILD.hostData) {

          if (BUILD.isDev) {
            // if (vnodeHostData && cmpMeta.membersMeta) {
            //   const foundHostKeys = Object.keys(vnodeHostData).reduce((err, k) => {
            //     if (cmpMeta.membersMeta[k]) {
            //       return err.concat(k);
            //     }
            //     if (cmpMeta.membersMeta[dashToPascalCase(k)]) {
            //       return err.concat(dashToPascalCase(k));
            //     }
            //     return err;
            //   }, <string[]>[]);

            //   if (foundHostKeys.length > 0) {
            //     throw new Error(
            //     `The following keys were attempted to be set with hostData() from the ` +
            //     `${elm.nodeName} component: ${foundHostKeys.join(', ')}. ` +
            //     `If you would like to modify these please set @Prop({ mutable: true, reflectToAttr: true}) ` +
            //     `on the @Prop() decorator.`
            //     );
            //   }
            // }
          }
        }

        // if (BUILD.reflectToAttr && reflectHostAttr) {
        //   vnodeHostData = vnodeHostData ? Object.assign(vnodeHostData, reflectHostAttr) : reflectHostAttr;
        // }

        // looks like we've got child nodes to render into this host element
        // or we need to update the css class/attrs on the host element

        if (BUILD.vdomRender) {
          // DOM WRITE!
          renderVdom(
            elm,
            elmData,
            cmpMeta,
            (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render()),
            instance.hostData && instance.hostData()
          );

        } else if (BUILD.noVdomRender) {
          // DOM WRITE!
          (BUILD.shadowDom ? elm.shadowRoot || elm : elm).textContent =
            (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render()) as string;
        }
      }

    } catch (e) {
      consoleError(e);
    }

    if (BUILD.updatable) {
      // tell the platform we're done rendering
      // now any changes will again queue
      elmData.isActiveRender = false;
    }
  }

  if (BUILD.style && isInitialLoad) {
    // DOM WRITE!
    attachStyles(elm);

    // if (BUILD.scoped) {
    //   const scopeId = elm['s-sc'];
    //   if (scopeId) {
    //     elm.classList.add(getElementScopeId(scopeId, true));

    //     if (encapsulation === 'scoped') {
    //       elm.classList.add(getElementScopeId(scopeId));
    //     }
    //   }
    // }
  }

  if (BUILD.lifecycle || BUILD.style) {
    // it's official, this element has rendered
    // DOM WRITE!
    elmData.hasRendered = elm['s-rn'] = true;
  } else if (BUILD.updatable) {
    // DOM WRITE!
    elmData.hasRendered = true;
  }

  if (BUILD.lifecycle && elm['s-rc']) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm['s-rc'].forEach(cb => cb());
    elm['s-rc'] = undefined;
  }

  // update styles!
  // if (BUILD.polyfills && plt.customStyle) {
  //   plt.customStyle.updateHost(elm);
  // }

  try {
    if (isInitialLoad) {
      if (BUILD.cmpDidLoad && instance.componentDidLoad) {
        instance.componentDidLoad();
      }

    } else if (BUILD.cmpDidUpdate && instance.componentDidUpdate) {
      // we've already loaded this component
      // fire off the user's componentDidUpdate method (if one was provided)
      // componentDidUpdate runs AFTER render() has been called
      // and all child components have finished updating
      instance.componentDidUpdate();
    }

  } catch (e) {
    consoleError(e);
  }

  // if (BUILD.polyfills && !allChildrenHaveConnected(plt, elm)) {
  //   // this check needs to be done when using the customElements polyfill
  //   // since the polyfill uses MutationObserver which causes the
  //   // connectedCallbacks to fire async, which isn't ideal for the code below
  //   return;
  // }

  // load events fire from bottom to top
  // the deepest elements load first then bubbles up
  // load events fire from bottom to top
  // the deepest elements load first then bubbles up
  if (BUILD.lifecycle && elmData.ancestorHostElement) {
    // ok so this element already has a known ancestor host element
    // let's make sure we remove this element from its ancestor's
    // known list of child elements which are actively loading
    ancestorsActivelyLoadingChildren = elmData.ancestorHostElement['s-al'];

    if (ancestorsActivelyLoadingChildren) {
      // remove this element from the actively loading map
      ancestorsActivelyLoadingChildren.delete(elm);

      // the ancestor's initLoad method will do the actual checks
      // to see if the ancestor is actually loaded or not
      // then let's call the ancestor's initLoad method if there's no length
      // (which actually ends up as this method again but for the ancestor)
      if (!ancestorsActivelyLoadingChildren.size) {
        elmData.ancestorHostElement['s-init']();
      }
    }

    elmData.ancestorHostElement = undefined;
  }

  // all is good, this component has been told it's time to finish loading
  // it's possible that we've already decided to destroy this element
  // check if this element has any actively loading child elements
  if (BUILD.lifecycle && (!elm['s-al'] || !elm['s-al'].size)) {
    // cool, so at this point this element isn't already being destroyed
    // and it does not have any child elements that are still loading

    // ensure we remove any child references cuz it doesn't matter at this point
    elm['s-al'] = undefined;

    if (BUILD.style) {
      // DOM WRITE!
      // add the css class that this element has officially hydrated
      elm.classList.add('hydrated');
    }

    if (BUILD.exposeAppOnReady) {
      activelyProcessingCmps.delete(elm);
    }
  }

  if (BUILD.exposeAppOnReady && onAppReadyCallbacks.length && !activelyProcessingCmps.size) {
    // we've got some promises waiting on the entire app to be done processing
    // so it should have an empty queue and no longer rendering
    let cb: any;
    while ((cb = onAppReadyCallbacks.shift())) {
      cb();
    }
  }

  if (BUILD.hotModuleReplacement) {
    elm['s-hmr-load'] && elm['s-hmr-load']();
  }

  if (BUILD.lazyLoad && isInitialLoad && elmData.onReadyResolve) {
    // fire off the user's elm.componentOnReady() resolve (if any)
    elmData.onReadyResolve(elm);
  }

  // ( •_•)
  // ( •_•)>⌐■-■
  // (⌐■_■)
};
