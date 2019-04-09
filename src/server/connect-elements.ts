import * as d from '../declarations';
import { hydrateComponent } from './hydrate-component';


export function connectElements(opts: d.HydrateOptions, results: d.HydrateResults, elm: HTMLElement, waitPromises: Promise<any>[], hydratedElements: Set<any>) {
  if (elm != null && typeof elm.nodeName === 'string') {

    const tagName = elm.nodeName.toLowerCase();

    if (!NO_HYDRATE_TAGS.has(tagName) && !elm.hasAttribute('no-prerender')) {
      if (!hydratedElements.has(elm)) {
        hydratedElements.add(elm);

        if (tagName.includes('-')) {
          hydrateComponent(opts, results, tagName, elm, waitPromises);

        } else if (opts.collectAnchors && tagName === 'a') {
          collectAnchors(results, elm as HTMLAnchorElement);

        } else if (opts.collectScripts && tagName === 'script') {
          collectScriptElement(results, elm as HTMLScriptElement);
          return;

        } else if (opts.collectStylesheets && tagName === 'link') {
          collectLinkElement(results, elm as HTMLLinkElement);
          return;

        } else if (opts.collectImgs && tagName === 'img') {
          collectImgElement(results, elm as HTMLImageElement);
          return;
        }
      }

      const children = elm.children;
      if (children != null) {
        for (let i = 0, ii = children.length; i < ii; i++) {
          connectElements(opts, results, children[i] as any, waitPromises, hydratedElements);
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
  const src = parsedElm.src;
  collectAttributes(elm, parsedElm);

  if (hydrateResults.scripts.some(a => a.src !== src)) {
    hydrateResults.scripts.push(parsedElm);
  }
}


function collectLinkElement(hydrateResults: d.HydrateResults, elm: HTMLLinkElement) {
  const rel = (elm.rel || '').toLowerCase();

  if (rel === 'stylesheet') {
    const parsedElm: d.HydrateStyleElement = {};
    const href = parsedElm.href;
    collectAttributes(elm, parsedElm);
    delete parsedElm.rel;
    delete parsedElm.type;

    if (hydrateResults.styles.some(a => a.href !== href)) {
      hydrateResults.styles.push(parsedElm);
    }
  }
}


function collectImgElement(hydrateResults: d.HydrateResults, elm: HTMLImageElement) {
  const parsedElm: d.HydrateImgElement = {};
  const src = parsedElm.src;
  collectAttributes(elm, parsedElm);

  if (hydrateResults.imgs.some(a => a.src !== src)) {
    hydrateResults.imgs.push(parsedElm);
  }
}


const NO_HYDRATE_TAGS = new Set([
  'code',
  'iframe',
  'input',
  'object',
  'output',
  'noscript',
  'pre',
  'select',
  'style',
  'template',
  'textarea'
]);
