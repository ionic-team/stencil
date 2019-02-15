import * as d from '@declarations';
import { hydrateComponent } from './hydrate-component';


export function connectElements(opts: d.HydrateOptions, results: d.HydrateResults, elm: HTMLElement) {
  if (elm != null && typeof elm.nodeName === 'string') {

    if (!elm.hasAttribute('no-prerender')) {
      const tagName = elm.nodeName.toLowerCase();

      if (tagName.includes('-')) {
        hydrateComponent(opts, results, tagName, elm);

      } else if (opts.collectScriptUrls && tagName === 'script') {
        collectScriptElement(results, elm as HTMLScriptElement);

      } else if (opts.collectStylesheetUrls && tagName === 'link') {
        collectLinkElement(results, elm as HTMLLinkElement);

      } else if (opts.collectImgUrls && tagName === 'img') {
        collectImgElement(results, elm as HTMLImageElement);
      }

      const children = elm.children;
      if (children != null) {
        for (let i = 0; i < children.length; i++) {
          connectElements(opts, results, children[i] as any);
        }
      }
    }
  }
}


function collectScriptElement(hydrateResults: d.HydrateResults, elm: HTMLScriptElement) {
  const src = elm.src;
  if (typeof src === 'string' && !hydrateResults.scriptUrls.includes(src)) {
    hydrateResults.scriptUrls.push(src);
  }
}


function collectLinkElement(hydrateResults: d.HydrateResults, elm: HTMLLinkElement) {
  const href = elm.href;
  const rel = elm.rel;
  if (typeof href === 'string' && typeof rel === 'string') {
    if (rel.toLowerCase() === 'stylesheet' && !hydrateResults.styleUrls.includes(href)) {
      hydrateResults.styleUrls.push(href);
    }
  }
}


function collectImgElement(hydrateResults: d.HydrateResults, elm: HTMLImageElement) {
  const src = elm.src;
  if (typeof src === 'string' && !hydrateResults.imgUrls.includes(src)) {
    hydrateResults.imgUrls.push(src);
  }
}
