import { CompilerCtx, ComponentRegistry, Config, HydrateOptions, HydrateResults, VNode } from '../util/interfaces';
import { collectAnchors, generateFailureDiagnostic, generateHydrateResults, normalizeDirection, normalizeHydrateOptions, normalizeLanguage } from './hydrate-utils';
import { connectChildElements } from './connect-element';
import { createPlatformServer } from './platform-server';
import { optimizeHtml } from '../compiler/html/optimize-html';
import { SSR_VNODE_ID } from '../util/constants';


export function hydrateHtml(config: Config, ctx: CompilerCtx, cmpRegistry: ComponentRegistry, opts: HydrateOptions): Promise<HydrateResults> {
  return new Promise(resolve => {

    // validate the hydrate options and add any missing info
    opts = normalizeHydrateOptions(opts);

    // create the results object we're gonna return
    const hydrateResults = generateHydrateResults(config, opts);

    // create a emulated window
    // attach data the request to the window
    const dom = config.sys.createDom();
    const win = dom.parse(opts);
    const doc = win.document;

    // normalize dir and lang before connecting elements
    // so that the info is their incase they read it at runtime
    normalizeDirection(doc, opts);
    normalizeLanguage(doc, opts);

    // create the platform
    const plt = createPlatformServer(
      config,
      win,
      doc,
      cmpRegistry,
      hydrateResults,
      opts.isPrerender,
      ctx
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
          await optimizeHtml(config, ctx, doc, styles, opts, hydrateResults);

          // gather up all of the <a> tag information in the doc
          if (opts.collectAnchors !== false) {
            collectAnchors(config, doc, hydrateResults);
          }

          // serialize this dom back into a string
          if (opts.serializeHtml !== false) {
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
          hydrateResults.html = opts.html;
        }
      }

      if (opts.destroyDom !== false) {
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

    // patch the render function that we can add SSR ids
    // and to connect any elements it may have just appened to the DOM
    let ssrIds = 0;
    const pltRender = plt.render;
    plt.render = function render(oldVNode: VNode, newVNode, isUpdate, hostContentNodes, encapsulation) {
      let ssrId: number;
      let existingSsrId: string;

      if (opts.ssrIds !== false) {
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

      newVNode = pltRender(oldVNode, newVNode, isUpdate, hostContentNodes, encapsulation, ssrId);

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
      hydrateResults.html = opts.html;
      resolve(hydrateResults);
    }
  });
}
