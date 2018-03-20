import { CustomStyle } from './custom-style';


export function initCssVarShim(win: any, doc: Document, customStyle: CustomStyle, callback: Function) {
  if (customStyle.supportsCssVars) {
    callback();

  } else {
    win.requestAnimationFrame(() => {
      const promises: Promise<any>[] = [];

      const linkElms = doc.querySelectorAll('link[rel="stylesheet"][href]');
      for (var i = 0; i < linkElms.length; i++) {
        promises.push(loadLinkStyles(doc, customStyle, linkElms[i] as any));
      }

      const styleElms = doc.querySelectorAll('style');
      for (i = 0; i < styleElms.length; i++) {
        promises.push(customStyle.addStyle(styleElms[i]));
      }

      Promise.all(promises).then(() => {
        callback();
      });
    });
  }
}


function loadLinkStyles(doc: Document, customStyle: CustomStyle, linkElm: HTMLLinkElement) {
  const url = linkElm.href;

  return fetch(url).then(rsp => rsp.text()).then(text => {

    if (hasCssVariables(text)) {
      const styleElm = doc.createElement('style');
      styleElm.innerHTML = text;
      linkElm.parentNode.insertBefore(styleElm, linkElm);

      return customStyle.addStyle(styleElm).then(() => {
        linkElm.parentNode.removeChild(linkElm);
      });
    }

    return Promise.resolve();

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
