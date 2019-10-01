import { CSSScope } from './interfaces';
import { addGlobalStyle, updateGlobalScopes } from './scope';

export function loadDocument(doc: Document, globalScopes: CSSScope[]) {
  loadDocumentStyles(doc, globalScopes);
  return loadDocumentLinks(doc, globalScopes);
}

export function startWatcher(doc: Document, globalScopes: CSSScope[]) {
  const mutation = new MutationObserver(() => {
    if (loadDocumentStyles(doc, globalScopes)) {
      updateGlobalScopes(globalScopes);
    }
  });
  mutation.observe(document.head, { childList: true });
}

export function loadDocumentLinks(doc: Document, globalScopes: CSSScope[]) {
  const promises: Promise<any>[] = [];

  const linkElms = doc.querySelectorAll('link[rel="stylesheet"][href]:not([data-no-shim])');
  for (let i = 0; i < linkElms.length; i++) {
    promises.push(addGlobalLink(doc, globalScopes, linkElms[i] as HTMLLinkElement));
  }
  return Promise.all(promises);
}

export function loadDocumentStyles(doc: Document, globalScopes: CSSScope[]) {
  const styleElms = Array.from(doc.querySelectorAll('style:not([data-styles]):not([data-no-shim])')) as HTMLStyleElement[];
  return styleElms
    .map(style => addGlobalStyle(globalScopes, style))
    .some(Boolean);
}

export function addGlobalLink(doc: Document, globalScopes: CSSScope[], linkElm: HTMLLinkElement) {
  const url = linkElm.href;
  return fetch(url).then(rsp => rsp.text()).then(text => {
    if (hasCssVariables(text) && linkElm.parentNode) {
      if (hasRelativeUrls(text)) {
        text = fixRelativeUrls(text, url);
      }
      const styleEl = doc.createElement('style');
      styleEl.setAttribute('data-styles', '');
      styleEl.textContent = text;

      addGlobalStyle(globalScopes, styleEl);
      linkElm.parentNode.insertBefore(styleEl, linkElm);
      linkElm.remove();
    }
  }).catch(err => {
    console.error(err);
  });
}


// This regexp tries to determine when a variable is declared, for example:
//
// .my-el { --highlight-color: green; }
//
// but we don't want to trigger when a classname uses "--" or a pseudo-class is
// used. We assume that the only characters that can preceed a variable
// declaration are "{", from an opening block, ";" from a preceeding rule, or a
// space. This prevents the regexp from matching a word in a selector, since
// they would need to start with a "." or "#". (We assume element names don't
// start with "--").
const CSS_VARIABLE_REGEXP = /[\s;{]--[-a-zA-Z0-9]+\s*:/m;

export function hasCssVariables(css: string) {
  return css.indexOf('var(') > -1 || CSS_VARIABLE_REGEXP.test(css);
}

// This regexp find all url() usages with relative urls
const CSS_URL_REGEXP = /url[\s]*\([\s]*['"]?(?!(?:https?|data)\:|\/)([^\'\"\)]*)[\s]*['"]?\)[\s]*/gim;

export function hasRelativeUrls(css: string) {
  CSS_URL_REGEXP.lastIndex = 0;
  return CSS_URL_REGEXP.test(css);
}


export function fixRelativeUrls(css: string, originalUrl: string) {
  // get the basepath from the original import url
  const basePath = originalUrl.replace(/[^/]*$/, '');

  // replace the relative url, with the new relative url
  return css.replace(CSS_URL_REGEXP, (fullMatch, url) => {
    // rhe new relative path is the base path + uri
    // TODO: normalize relative URL
    const relativeUrl = basePath + url;
    return fullMatch.replace(url, relativeUrl);
  });
}
