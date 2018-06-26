import { parseQuerystring, stringifyQuerystring, updateCssUrlValue, updateHmrHref } from './hmr-util';


export function hmrImages(win: Window, doc: Document, versionId: string, imageFileNames: string[]) {
  if (win.location.protocol !== 'file:' && doc.styleSheets) {
    hmrStyleSheetsImages(doc, versionId, imageFileNames);
  }

  hmrImagesElements(win, doc.documentElement, versionId, imageFileNames);
}


function hmrStyleSheetsImages(doc: Document, versionId: string, imageFileNames: string[]) {
  const cssImageProps = Object.keys(doc.documentElement.style).filter(cssProp => {
    return cssProp.endsWith('Image');
  });

  for (let i = 0; i < doc.styleSheets.length; i++) {
    hmrStyleSheetImages(cssImageProps, doc.styleSheets[i] as CSSStyleSheet, versionId, imageFileNames);
  }
}


function hmrStyleSheetImages(cssImageProps: string[], styleSheet: CSSStyleSheet, versionId: string, imageFileNames: string[]) {
  try {
    const cssRules = styleSheet.cssRules;
    for (let i = 0; i < cssRules.length; i++) {
      const cssRule = cssRules[i];

      switch (cssRule.type) {
        case CSSRule.IMPORT_RULE:
          hmrStyleSheetImages(cssImageProps, (cssRule as CSSImportRule).styleSheet, versionId, imageFileNames);
          break;

        case CSSRule.STYLE_RULE:
          hmrStyleSheetRuleImages(cssImageProps, (cssRule as CSSStyleRule), versionId, imageFileNames);
          break;

        case CSSRule.MEDIA_RULE:
          hmrStyleSheetImages(cssImageProps, (cssRule as any), versionId, imageFileNames);
          break;
      }
    }

  } catch (e) {
    console.error('hmrStyleSheetImages: ' + e);
  }
}


function hmrStyleSheetRuleImages(cssImageProps: string[], cssRule: CSSStyleRule, versionId: string, imageFileNames: string[]) {
  cssImageProps.forEach(cssImageProp => {
    imageFileNames.forEach(imageFileName => {
      const oldCssText = (cssRule as any).style[cssImageProp];
      const newCssText = updateCssUrlValue(versionId, imageFileName, oldCssText);

      if (oldCssText !== newCssText) {
        (cssRule as any).style[cssImageProp] = newCssText;
      }
    });
  });
}


export function hmrImagesElements(win: Window, elm: Element, versionId: string, imageFileNames: string[]) {
  if (elm.nodeName.toLowerCase() === 'img') {
    hmrImgElement(elm as HTMLImageElement, versionId, imageFileNames);
  }

  if (elm.getAttribute) {
    const styleAttr = elm.getAttribute('style');
    if (styleAttr) {
      hmrUpdateStyleAttr(elm, versionId, imageFileNames, styleAttr);
    }
  }

  if (elm.nodeName.toLowerCase() === 'style') {
    hmrUpdateStyleElementUrl(elm as HTMLStyleElement, versionId, imageFileNames);
  }

  if (win.location.protocol === 'file:') {
    if (elm.nodeName.toLowerCase() === 'link') {
      hmrUpdateLinkElementUrl(elm as HTMLLinkElement, versionId, imageFileNames);
    }
  }

  if (elm.nodeName.toLowerCase() === 'template' && (elm as HTMLTemplateElement).content) {
    hmrImagesElements(win, (elm as HTMLTemplateElement).content as any, versionId, imageFileNames);
  }

  if (elm.shadowRoot) {
    hmrImagesElements(win, elm.shadowRoot as any, versionId, imageFileNames);
  }

  if (elm.children) {
    for (let i = 0; i < elm.children.length; i++) {
      hmrImagesElements(win, elm.children[i], versionId, imageFileNames);
    }
  }
}


function hmrImgElement(imgElm: HTMLImageElement, versionId: string, imageFileNames: string[]) {
  imageFileNames.forEach(imageFileName => {
    imgElm.src = updateHmrHref(versionId, imageFileName, imgElm.src);
    imgElm.setAttribute('data-hmr', versionId);
  });
}


function hmrUpdateStyleAttr(elm: Element, versionId: string, imageFileNames: string[], oldStyleAttr: string) {
  imageFileNames.forEach(imageFileName => {
    const newSstyleAttr = updateCssUrlValue(versionId, imageFileName, oldStyleAttr);

    if (newSstyleAttr !== oldStyleAttr) {
      elm.setAttribute('style', newSstyleAttr);
      elm.setAttribute('data-hmr', versionId);
    }
  });
}


function hmrUpdateStyleElementUrl(styleElm: HTMLStyleElement, versionId: string, imageFileNames: string[]) {
  imageFileNames.forEach(imageFileName => {
    styleElm.innerHTML = updateCssUrlValue(versionId, imageFileName, styleElm.innerHTML);
    styleElm.setAttribute('data-hmr', versionId);
  });
}


function hmrUpdateLinkElementUrl(linkElm: HTMLLinkElement, versionId: string, imageFileNames: string[]) {
  if (!linkElm.href || !linkElm.rel || linkElm.rel.toLowerCase() !== 'stylesheet') {
    return;
  }

  const hrefSplt = linkElm.href.split('?');
  const hrefFileName = hrefSplt[0];

  const newQs = parseQuerystring(hrefSplt[1]);

  newQs['s-hmr'] = versionId;
  newQs['s-hmr-urls'] = imageFileNames.join(',');

  linkElm.href = hrefFileName + '?' + stringifyQuerystring(newQs);
  linkElm.setAttribute('data-hmr', versionId);
}
