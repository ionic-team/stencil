import * as d from '../declarations';
import { attachStyles } from './styles';
import { consoleError } from './log';
import { propagateComponentReady } from './propagate-cmp-ready';
import { supportsShadowDom } from './data';
import { vdomRender } from '../renderer/vdom/render';


export const update = async (elm: d.HostElement, instance: any, elmData: d.ElementData, cmpMeta: d.ComponentRuntimeMeta, isInitialLoad?: boolean) => {
  // update
  if (BUILD.taskQueue) {
    elmData.isQueuedForUpdate = false;
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

  if (BUILD.shadowDom && isInitialLoad && supportsShadowDom && cmpMeta.shadowDomEncapsulation) {
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
          vdomRender(
            elm,
            cmpMeta,
            elmData.vnode || {},
            (BUILD.allRenderFn) ? instance.render() : (instance.render && instance.render()),
            instance.hostData && instance.hostData()
          );

        } else if (BUILD.noVdomRender) {
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
    elmData.hasRendered = elm['s-rn'] = true;
  } else if (BUILD.updatable) {
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

  if (BUILD.updatable || BUILD.lifecycle) {
    elmData.firedDidLoad = true;
  }

  // if (BUILD.polyfills && !allChildrenHaveConnected(plt, elm)) {
  //   // this check needs to be done when using the customElements polyfill
  //   // since the polyfill uses MutationObserver which causes the
  //   // connectedCallbacks to fire async, which isn't ideal for the code below
  //   return;
  // }

  // all is good, this component has been told it's time to finish loading
  // it's possible that we've already decided to destroy this element
  // check if this element has any actively loading child elements
  if (BUILD.style && (BUILD.lifecycle && (!elm['s-ld'] || !elm['s-ld'].length))) {
    // cool, so at this point this element isn't already being destroyed
    // and it does not have any child elements that are still loading

    if (!elmData.firedDidLoad) {
      if (BUILD.lifecycle) {
        // ensure we remove any child references cuz it doesn't matter at this point
        elm['s-ld'] = undefined;
      }

      if (BUILD.style) {
        // add the css class that this element has officially hydrated
        elm.classList.add('hydrated');
      }
    }

    if (BUILD.lifecycle) {
      // load events fire from bottom to top
      // the deepest elements load first then bubbles up
      propagateComponentReady(elm, elmData);
    }
  }

  if (BUILD.hotModuleReplacement) {
    elm['s-hmr-load'] && elm['s-hmr-load']();
  }

  if (BUILD.lazyLoad && isInitialLoad) {
    // fire off the user's elm.componentOnReady() resolve (if any)
    elmData.onReadyResolve && elmData.onReadyResolve(elm);
  }

  // ( •_•)
  // ( •_•)>⌐■-■
  // (⌐■_■)
};
