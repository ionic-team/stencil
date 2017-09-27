import { BuildConfig, BuildContext, ComponentRegistry, HostElement, PlatformApi,
  HostContentNodes, HydrateOptions, HydrateResults, VNode } from '../util/interfaces';
import { createPlatformServer } from './platform-server';
import { initHostConstructor } from '../core/instance/init';
import { optimizeHtml } from '../compiler/html/optimize-html';
import { SSR_VNODE_ID } from '../util/constants';


export function hydrateHtml(config: BuildConfig, ctx: BuildContext, registry: ComponentRegistry, opts: HydrateOptions, hydrateResults: HydrateResults, callback: (results?: HydrateResults) => void) {
  const registeredTags = Object.keys(registry || {});
  let ssrIds = 0;

  // if there are no components registered at all
  // then let's skip all this (and why didn't we get components!?)
  if (registeredTags.length === 0) {
    hydrateResults.diagnostics.push({
      header: 'Hydrate Components',
      messageText: `No registered components found`,
      type: 'hydrate',
      level: 'info'
    });
    hydrateResults.html = opts.html;
    return callback(hydrateResults);
  }

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
    hydrateResults.diagnostics,
    opts.isPrerender,
    ctx
  );

  // fully define each of our components onto this new platform instance
  registeredTags.forEach(registryTag => {
    // registry tags are always UPPER-CASE
    // component meta tags are lower-case
    registryTag = registryTag.toUpperCase();
    registry[registryTag].tagNameMeta = registryTag.toLowerCase();
    registry[registryTag].membersMeta = registry[registryTag].membersMeta || {};
    plt.defineComponent(registry[registryTag]);
  });

  // fire off this function when the app has finished loading
  // and all components have finished hydrating
  plt.onAppLoad = (rootElm, stylesMap) => {

    if (config._isTesting) {
      (hydrateResults as any).__testPlatform = plt;
    }

    hydrateResults.root = rootElm;

    // all synchronous operations next
    if (rootElm) {
      try {
        // optimize this document!!
        optimizeHtml(config, ctx, doc, stylesMap, opts, hydrateResults);

        // gather up all of the <a> tag information in the doc
        if (opts.collectAnchors !== false) {
          collectAnchors(doc, hydrateResults);
        }

        // serialize this dom back into a string
        if (opts.serializeHtml !== false) {
          hydrateResults.html = dom.serialize();
        }

        // also collect up any dom errors that may have happened
        hydrateResults.diagnostics = hydrateResults.diagnostics.concat(dom.getDiagnostics());

        // terminate all running timers and also remove any
        // event listeners on the window and document
        if (opts.serializeHtml !== false) {
          dom.destroy();
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

    // cool, all good here, even if there are errors
    // we're passing back the result object
    callback(hydrateResults);
  };

  // keep a collection of all the host elements we connected
  const connectedInfo: ConnectedInfo = {
    elementCount: 0
  };

  // patch the render function that we can add SSR ids
  // and to connect any elements it may have just appened to the DOM
  const pltRender = plt.render;
  plt.render = function render(oldVNode: VNode, newVNode: VNode, isUpdate: boolean, hostContentNodes: HostContentNodes) {
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

    newVNode = pltRender(oldVNode, newVNode, isUpdate, hostContentNodes, ssrId);

    connectElement(plt, <HostElement>newVNode.elm, connectedInfo);

    return newVNode;
  };

  // loop through each node and start connecting/hydrating
  // any elements that are host elements to components
  // this kicks off all the async loading and hydrating
  connectElement(plt, <any>win.document.body, connectedInfo);

  if (connectedInfo.elementCount === 0) {
    // what gives, never found ANY host elements to connect!
    // ok we're just done i guess, idk
    hydrateResults.diagnostics.push({
      header: 'Hydrate Components',
      level: 'info',
      type: 'hydrate',
      messageText: 'No elements connected'
    });
    hydrateResults.html = opts.html;
    callback(hydrateResults);
  }
}


export function connectElement(plt: PlatformApi, elm: HostElement, connectedInfo: ConnectedInfo) {
  if (!elm._hasConnected) {
    // only connect elements which is a registered component
    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta) {
      // init our host element functions
      // not using Element.prototype on purpose
      if (!elm.connectedCallback) {
        initHostConstructor(plt, elm);
      }

      // cool, let the element know it's been connected
      elm.connectedCallback();

      // keep count of how many host elements we actually connected
      connectedInfo.elementCount++;
    }
  }

  const elmChildren = elm.children;
  if (elmChildren) {
    // continue drilling down through child elements
    for (var i = 0, l = elmChildren.length; i < l; i++) {
      connectElement(plt, <HostElement>elmChildren[i], connectedInfo);
    }
  }
}


function collectAnchors(doc: Document, hydrateResults: HydrateResults) {
  const anchorElements = doc.querySelectorAll('a');

  for (var i = 0; i < anchorElements.length; i++) {
    var attrs: any = {};
    var anchorAttrs = anchorElements[i].attributes;

    for (var j = 0; j < anchorAttrs.length; j++) {
      attrs[anchorAttrs[j].nodeName.toLowerCase()] = anchorAttrs[j].nodeValue;
    }

    hydrateResults.anchors.push(attrs);
  }
}


function normalizeDirection(doc: Document, opts: HydrateOptions) {
  let dir = doc.body.getAttribute('dir');
  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir.trim().length > 0) {
      console.warn(`dir="${dir}" should be placed on the <html> instead of <body>`);
    }
  }

  if (opts.dir) {
    dir = opts.dir;
  } else {
    dir = doc.documentElement.getAttribute('dir');
  }

  if (dir) {
    dir = dir.trim().toLowerCase();
    if (dir !== 'ltr' && dir !== 'rtl') {
      console.warn(`only "ltr" and "rtl" are valid "dir" values on the <html> element`);
    }
  }

  if (dir !== 'ltr' && dir !== 'rtl') {
    dir = 'ltr';
  }

  doc.documentElement.dir = dir;
}


function normalizeLanguage(doc: Document, opts: HydrateOptions) {
  let lang = doc.body.getAttribute('lang');
  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.trim().length > 0) {
      console.warn(`lang="${lang}" should be placed on <html> instead of <body>`);
    }
  }

  if (opts.lang) {
    lang = opts.lang;
  } else {
    lang = doc.documentElement.getAttribute('lang');
  }

  if (lang) {
    lang = lang.trim().toLowerCase();
    if (lang.length > 0) {
      doc.documentElement.lang = lang;
    }
  }
}


export interface ConnectedInfo {
  elementCount: number;
}

