import { ComponentMeta, Config, HostElement, HydrateResults, PlatformApi } from '../declarations';
import { connectedCallback } from '../core/connected';
import { ENCAPSULATION } from '../util/constants';
import { initHostElement } from '../core/init-host-element';
import { noop } from '../util/helpers';


export function connectChildElements(config: Config, plt: PlatformApi, hydrateResults: HydrateResults, parentElm: Element) {
  if (parentElm && parentElm.children) {
    for (var i = 0; i < parentElm.children.length; i++) {
      connectElement(config, plt, hydrateResults, parentElm.children[i]);
      connectChildElements(config, plt, hydrateResults, parentElm.children[i]);
    }
  }
}


export function connectElement(config: Config, plt: PlatformApi, hydrateResults: HydrateResults, elm: Element) {
  if (!plt.hasConnectedMap.has(elm as HostElement)) {
    const tagName = elm.tagName.toLowerCase();
    const cmpMeta = plt.getComponentMeta(elm);

    if (cmpMeta) {
      connectHostElement(config, plt, hydrateResults, elm as HostElement, cmpMeta);

    } else if (tagName === 'script') {
      connectScriptElement(hydrateResults, elm as HTMLScriptElement);

    } else if (tagName === 'link') {
      connectLinkElement(hydrateResults, elm as HTMLLinkElement);

    } else if (tagName === 'img') {
      connectImgElement(hydrateResults, elm as HTMLImageElement);
    }

    plt.hasConnectedMap.set(elm as HostElement, true);
  }
}


function connectHostElement(config: Config, plt: PlatformApi, hydrateResults: HydrateResults, elm: HostElement, cmpMeta: ComponentMeta) {
  if (!cmpMeta.componentConstructor) {
    plt.connectHostElement(cmpMeta, elm);
    plt.loadBundle(cmpMeta, elm.mode, noop);
  }

  if (cmpMeta.encapsulation !== ENCAPSULATION.ShadowDom) {
    initHostElement(plt, cmpMeta, elm, config.hydratedCssClass);

    connectedCallback(plt, cmpMeta, elm);
  }

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


function connectScriptElement(hydrateResults: HydrateResults, elm: HTMLScriptElement) {
  const src = elm.src;
  if (src && hydrateResults.scriptUrls.indexOf(src) === -1) {
    hydrateResults.scriptUrls.push(src);
  }
}


function connectLinkElement(hydrateResults: HydrateResults, elm: HTMLLinkElement) {
  const href = elm.href;
  const rel = (elm.rel || '').toLowerCase();
  if (rel === 'stylesheet' && href && hydrateResults.styleUrls.indexOf(href) === -1) {
    hydrateResults.styleUrls.push(href);
  }
}


function connectImgElement(hydrateResults: HydrateResults, elm: HTMLImageElement) {
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
