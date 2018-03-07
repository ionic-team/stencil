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


export function hasCssVariables(css: string) {
  return css.indexOf('var(') > -1 || /--[-a-zA-Z0-9\s]+:/.test(css);
}
