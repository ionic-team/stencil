import * as d from '../declarations';
import { collectAnchors, generateFailureDiagnostic, generateHydrateResults, normalizeDirection, normalizeHydrateOptions, normalizeLanguage } from './hydrate-utils';
import { connectChildElements } from './connect-element';
import { createPlatformServer } from './platform-server';
import { optimizeHtml } from '../compiler/html/optimize-html';
import { SSR_VNODE_ID } from '../util/constants';


export function hydrateHtml(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetHydrate, cmpRegistry: d.ComponentRegistry, opts: d.HydrateOptions) {
  return new Promise<d.HydrateResults>(resolve => {

    // validate the hydrate options and add any missing info
    const hydrateTarget = normalizeHydrateOptions(outputTarget, opts);

    // create the results object we're gonna return
    const hydrateResults = generateHydrateResults(config, hydrateTarget);

    // create a emulated window
    // attach data the request to the window
    const dom = config.sys.createDom();
    const win = dom.parse(hydrateTarget);
    const doc = win.document;

    // normalize dir and lang before connecting elements
    // so that the info is their incase they read it at runtime
    normalizeDirection(doc, hydrateTarget);
    normalizeLanguage(doc, hydrateTarget);

    // create the platform
    const plt = createPlatformServer(
      config,
      hydrateTarget,
      win,
      doc,
      cmpRegistry,
      hydrateResults.diagnostics,
      hydrateTarget.isPrerender,
      compilerCtx
    );

    // fire off this function when the app has finished loading
    // and all components have finished hydrating
    plt.onAppLoad = async (rootElm, styles, failureDiagnostic) => {

      if (config._isTesting) {
        (hydrateResults as any).__testPlatform = plt;
      }

      if (failureDiagnostic) {
        hydrateResults.html = generateFailureDiagnostic(failureDiagnostic);
        dom.destroy();
        resolve(hydrateResults);
        return;
      }

      // all synchronous operations next
      if (rootElm) {
        try {
          // optimize this document!!
          await optimizeHtml(config, compilerCtx, hydrateTarget, hydrateResults.url, doc, styles, hydrateResults.diagnostics);

          // gather up all of the <a> tag information in the doc
          if (hydrateTarget.isPrerender && hydrateTarget.hydrateComponents) {
            collectAnchors(config, doc, hydrateResults);
          }

          // serialize this dom back into a string
          if (hydrateTarget.serializeHtml !== false) {
            hydrateResults.html = dom.serialize();
          }

        } catch (e) {
          // gahh, something's up
          hydrateResults.diagnostics.push({
            level: 'error',
            type: 'hydrate',
            header: 'DOM Serialize',
            messageText: e
          });

          // idk, some error, just use the original html
          hydrateResults.html = hydrateTarget.html;
        }
      }

      if (hydrateTarget.destroyDom !== false) {
        // always destroy the dom unless told otherwise
        dom.destroy();

      } else {
        // we didn't destroy the dom
        // so let's return the root element
        hydrateResults.root = rootElm;
      }

      // cool, all good here, even if there are errors
      // we're passing back the result object
      resolve(hydrateResults);
    };

    if (hydrateTarget.hydrateComponents === false) {
      plt.onAppLoad(win.document.body as any, []);
      return;
    }

    // patch the render function that we can add SSR ids
    // and to connect any elements it may have just appened to the DOM
    let ssrIds = 0;
    const pltRender = plt.render;
    plt.render = function render(oldVNode: d.VNode, newVNode, isUpdate, defaultSlots, namedSlotsMap, encapsulation) {
      let ssrId: number;
      let existingSsrId: string;

      if (hydrateTarget.ssrIds !== false) {
        // this may have been patched more than once
        // so reuse the ssr id if it already has one
        if (oldVNode && oldVNode.elm) {
          existingSsrId = (oldVNode.elm as HTMLElement).getAttribute(SSR_VNODE_ID);
        }

        if (existingSsrId) {
          ssrId = parseInt(existingSsrId, 10);
        } else {
          ssrId = ssrIds++;
        }
      }

      newVNode = pltRender(oldVNode, newVNode, isUpdate, defaultSlots, namedSlotsMap, encapsulation, ssrId);

      connectChildElements(config, plt, hydrateResults, newVNode.elm as Element);

      return newVNode;
    };

    // loop through each node and start connecting/hydrating
    // any elements that are host elements to components
    // this kicks off all the async hydrating
    connectChildElements(config, plt, hydrateResults, win.document.body);

    if (hydrateResults.components.length === 0) {
      // what gives, never found ANY host elements to connect!
      // ok we're just done i guess, idk
      hydrateResults.html = hydrateTarget.html;
      resolve(hydrateResults);
    }
  });
}
