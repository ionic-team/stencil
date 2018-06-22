import * as d from '../declarations';
import { connectedCallback } from '../core/connected';
import { ENCAPSULATION } from '../util/constants';
import { initHostElement } from '../core/init-host-element';
import { initHostSnapshot } from '../core/host-snapshot';


export function connectChildElements(config: d.Config, plt: d.PlatformApi, App: d.AppGlobal, hydrateResults: d.HydrateResults, parentElm: Element) {
  if (parentElm && parentElm.children) {
    for (let i = 0; i < parentElm.children.length; i++) {
      connectElement(config, plt, App, hydrateResults, parentElm.children[i]);
      connectChildElements(config, plt, App, hydrateResults, parentElm.children[i]);
    }
  }
}


export function connectElement(config: d.Config, plt: d.PlatformApi, App: d.AppGlobal, hydrateResults: d.HydrateResults, elm: Element) {
  if (!plt.hasConnectedMap.has(elm as d.HostElement)) {
    const tagName = elm.tagName.toLowerCase();
    const cmpMeta = plt.getComponentMeta(elm);

    if (cmpMeta) {
      connectHostElement(config, plt, App, hydrateResults, elm as d.HostElement, cmpMeta);

    } else if (tagName === 'script') {
      connectScriptElement(hydrateResults, elm as HTMLScriptElement);

    } else if (tagName === 'link') {
      connectLinkElement(hydrateResults, elm as HTMLLinkElement);

    } else if (tagName === 'img') {
      connectImgElement(hydrateResults, elm as HTMLImageElement);
    }

    plt.hasConnectedMap.set(elm as d.HostElement, true);
  }
}


function connectHostElement(config: d.Config, plt: d.PlatformApi, App: d.AppGlobal, hydrateResults: d.HydrateResults, elm: d.HostElement, cmpMeta: d.ComponentMeta) {
  const hostSnapshot = initHostSnapshot(plt.domApi, cmpMeta, elm);
  plt.hostSnapshotMap.set(elm, hostSnapshot);

  if (!cmpMeta.componentConstructor) {
    plt.requestBundle(cmpMeta, elm);
  }

  if (cmpMeta.encapsulation !== ENCAPSULATION.ShadowDom) {
    initHostElement(plt, cmpMeta, elm, config.hydratedCssClass);

    connectedCallback(plt, cmpMeta, elm);
  }

  connectComponentOnReady(App, elm);

  const depth = getNodeDepth(elm);

  const cmp = hydrateResults.components.find(c => c.tag === cmpMeta.tagNameMeta);
  if (cmp) {
    cmp.count++;
    if (depth > cmp.depth) {
      cmp.depth = depth;
    }

  } else {
    hydrateResults.components.push({
      tag: cmpMeta.tagNameMeta,
      count: 1,
      depth: depth
    });
  }
}


export function connectComponentOnReady(App: d.AppGlobal, elm: d.HostElement) {
  elm.componentOnReady = function componentOnReady(): any {
    return new Promise(resolve => {
      App.componentOnReady(elm, resolve);
    });
  };
}


function connectScriptElement(hydrateResults: d.HydrateResults, elm: HTMLScriptElement) {
  const src = elm.src;
  if (src && hydrateResults.scriptUrls.indexOf(src) === -1) {
    hydrateResults.scriptUrls.push(src);
  }
}


function connectLinkElement(hydrateResults: d.HydrateResults, elm: HTMLLinkElement) {
  const href = elm.href;
  const rel = (elm.rel || '').toLowerCase();

  if (rel === 'stylesheet' && href && hydrateResults.styleUrls.indexOf(href) === -1) {
    hydrateResults.styleUrls.push(href);
  }
}


function connectImgElement(hydrateResults: d.HydrateResults, elm: HTMLImageElement) {
  const src = elm.src;

  if (src && hydrateResults.imgUrls.indexOf(src) === -1) {
    hydrateResults.imgUrls.push(src);
  }
}


function getNodeDepth(elm: Node) {
  let depth = 0;

  while (elm.parentNode) {
    depth++;
    elm = elm.parentNode;
  }

  return depth;
}
