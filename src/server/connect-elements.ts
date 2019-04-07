import * as d from '../declarations';
import { hydrateComponent } from './hydrate-component';


export function connectElements(opts: d.HydrateOptions, results: d.HydrateResults, elm: HTMLElement, waitPromises: Promise<any>[], hydratedElements: WeakSet<any>, collectedElements: WeakSet<any>) {
  if (elm != null && typeof elm.nodeName === 'string') {

    if (!elm.hasAttribute('no-prerender')) {
      const tagName = elm.nodeName.toLowerCase();

      if (tagName.includes('-') === true) {
        if (!hydratedElements.has(elm)) {
          hydratedElements.add(elm);
          hydrateComponent(opts, results, tagName, elm, waitPromises, hydratedElements, collectedElements);
        }

      } else if (opts.collectAnchors === true && tagName === 'a') {
        if (!collectedElements.has(elm)) {
          collectedElements.add(elm);
          collectAnchors(results, elm as HTMLAnchorElement);
        }

      } else if (opts.collectScripts === true && tagName === 'script') {
        if (!collectedElements.has(elm)) {
          collectedElements.add(elm);
          collectScriptElement(results, elm as HTMLScriptElement);
        }

      } else if (opts.collectStylesheets === true && tagName === 'link') {
        if (!collectedElements.has(elm)) {
          collectedElements.add(elm);
          collectLinkElement(results, elm as HTMLLinkElement);
        }

      } else if (opts.collectImgs === true && tagName === 'img') {
        if (!collectedElements.has(elm)) {
          collectedElements.add(elm);
          collectImgElement(results, elm as HTMLImageElement);
        }
      }

      const children = elm.children;
      if (children != null) {
        for (let i = 0, ii = children.length; i < ii; i++) {
          connectElements(opts, results, children[i] as any, waitPromises, hydratedElements, collectedElements);
        }
      }
    }
  }
}


function collectAttributes(node: HTMLElement, parsedElm: d.HydrateElement) {
  const attrs = node.attributes;
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs.item(i);
    parsedElm[attr.nodeName.toLowerCase()] = attr.nodeValue;
  }
}


function collectAnchors(hydrateResults: d.HydrateResults, elm: HTMLAnchorElement) {
  const parsedElm: d.HydrateAnchorElement = {};
  collectAttributes(elm, parsedElm);

  if (hydrateResults.anchors.some(a => a.href === parsedElm.href) === false) {
    hydrateResults.anchors.push(parsedElm);
  }
}


function collectScriptElement(hydrateResults: d.HydrateResults, elm: HTMLScriptElement) {
  const parsedElm: d.HydrateScriptElement = {};
  collectAttributes(elm, parsedElm);

  if (hydrateResults.scripts.some(a => a.src === parsedElm.src) === false) {
    hydrateResults.scripts.push(parsedElm);
  }
}


function collectLinkElement(hydrateResults: d.HydrateResults, elm: HTMLLinkElement) {
  const rel = (elm.rel || '').toLowerCase();

  if (rel === 'stylesheet') {
    const parsedElm: d.HydrateStyleElement = {};
    collectAttributes(elm, parsedElm);
    delete parsedElm.rel;
    delete parsedElm.type;

    if (hydrateResults.styles.some(a => a.href === parsedElm.href) === false) {
      hydrateResults.styles.push(parsedElm);
    }
  }
}


function collectImgElement(hydrateResults: d.HydrateResults, elm: HTMLImageElement) {
  const parsedElm: d.HydrateImgElement = {};
  collectAttributes(elm, parsedElm);

  if (hydrateResults.imgs.some(a => a.src === parsedElm.src) === false) {
    hydrateResults.imgs.push(parsedElm);
  }
}
