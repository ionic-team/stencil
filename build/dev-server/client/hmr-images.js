import { getHmrHref, hasShadowRoot, isElement, isLinkStylesheet, isTemplate, setHmrAttr, setHmrQueryString, setQueryString, updateCssUrlValue, } from './hmr-util';
export const hmrImages = (win, doc, versionId, imageFileNames) => {
    if (win.location.protocol !== 'file:' && doc.styleSheets) {
        hmrStyleSheetsImages(doc, versionId, imageFileNames);
    }
    hmrImagesElements(win, doc.documentElement, versionId, imageFileNames);
    return imageFileNames.sort();
};
const hmrStyleSheetsImages = (doc, versionId, imageFileNames) => {
    const cssImageProps = Object.keys(doc.documentElement.style).filter((cssProp) => {
        return cssProp.endsWith('Image');
    });
    for (let i = 0; i < doc.styleSheets.length; i++) {
        hmrStyleSheetImages(cssImageProps, doc.styleSheets[i], versionId, imageFileNames);
    }
};
const hmrStyleSheetImages = (cssImageProps, styleSheet, versionId, imageFileNames) => {
    try {
        const cssRules = styleSheet.cssRules;
        for (let i = 0; i < cssRules.length; i++) {
            const cssRule = cssRules[i];
            switch (cssRule.type) {
                case CSSRule.IMPORT_RULE:
                    hmrStyleSheetImages(cssImageProps, cssRule.styleSheet, versionId, imageFileNames);
                    break;
                case CSSRule.STYLE_RULE:
                    hmrStyleSheetRuleImages(cssImageProps, cssRule, versionId, imageFileNames);
                    break;
                case CSSRule.MEDIA_RULE:
                    hmrStyleSheetImages(cssImageProps, cssRule, versionId, imageFileNames);
                    break;
            }
        }
    }
    catch (e) {
        console.error('hmrStyleSheetImages: ' + e);
    }
};
const hmrStyleSheetRuleImages = (cssImageProps, cssRule, versionId, imageFileNames) => {
    cssImageProps.forEach((cssImageProp) => {
        imageFileNames.forEach((imageFileName) => {
            const oldCssText = cssRule.style[cssImageProp];
            const newCssText = updateCssUrlValue(versionId, imageFileName, oldCssText);
            if (oldCssText !== newCssText) {
                cssRule.style[cssImageProp] = newCssText;
            }
        });
    });
};
const hmrImagesElements = (win, elm, versionId, imageFileNames) => {
    const tagName = elm.nodeName.toLowerCase();
    if (tagName === 'img') {
        hmrImgElement(elm, versionId, imageFileNames);
    }
    if (isElement(elm)) {
        const styleAttr = elm.getAttribute('style');
        if (styleAttr) {
            hmrUpdateStyleAttr(elm, versionId, imageFileNames, styleAttr);
        }
    }
    if (tagName === 'style') {
        hmrUpdateStyleElementUrl(elm, versionId, imageFileNames);
    }
    if (win.location.protocol !== 'file:' && isLinkStylesheet(elm)) {
        hmrUpdateLinkElementUrl(elm, versionId, imageFileNames);
    }
    if (isTemplate(elm)) {
        hmrImagesElements(win, elm.content, versionId, imageFileNames);
    }
    if (hasShadowRoot(elm)) {
        hmrImagesElements(win, elm.shadowRoot, versionId, imageFileNames);
    }
    if (elm.children) {
        for (let i = 0; i < elm.children.length; i++) {
            hmrImagesElements(win, elm.children[i], versionId, imageFileNames);
        }
    }
};
const hmrImgElement = (imgElm, versionId, imageFileNames) => {
    imageFileNames.forEach((imageFileName) => {
        const orgSrc = imgElm.getAttribute('src');
        const newSrc = getHmrHref(versionId, imageFileName, orgSrc);
        if (newSrc !== orgSrc) {
            imgElm.setAttribute('src', newSrc);
            setHmrAttr(imgElm, versionId);
        }
    });
};
const hmrUpdateStyleAttr = (elm, versionId, imageFileNames, oldStyleAttr) => {
    imageFileNames.forEach((imageFileName) => {
        const newStyleAttr = updateCssUrlValue(versionId, imageFileName, oldStyleAttr);
        if (newStyleAttr !== oldStyleAttr) {
            elm.setAttribute('style', newStyleAttr);
            setHmrAttr(elm, versionId);
        }
    });
};
const hmrUpdateStyleElementUrl = (styleElm, versionId, imageFileNames) => {
    imageFileNames.forEach((imageFileName) => {
        const oldCssText = styleElm.innerHTML;
        const newCssText = updateCssUrlValue(versionId, imageFileName, oldCssText);
        if (newCssText !== oldCssText) {
            styleElm.innerHTML = newCssText;
            setHmrAttr(styleElm, versionId);
        }
    });
};
const hmrUpdateLinkElementUrl = (linkElm, versionId, imageFileNames) => {
    linkElm.href = setQueryString(linkElm.href, 's-hmr-urls', imageFileNames.sort().join(','));
    linkElm.href = setHmrQueryString(linkElm.href, versionId);
    // TODO(STENCIL-958): determine if we need to set this attribute
    linkElm.setAttribute('data-hmr', versionId);
};
//# sourceMappingURL=hmr-images.js.map