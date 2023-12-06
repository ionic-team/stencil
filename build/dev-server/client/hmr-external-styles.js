import { getHmrHref, hasShadowRoot, isLinkStylesheet, isTemplate, setHmrAttr } from './hmr-util';
export const hmrExternalStyles = (elm, versionId, cssFileNames) => {
    if (isLinkStylesheet(elm)) {
        cssFileNames.forEach((cssFileName) => {
            hmrStylesheetLink(elm, versionId, cssFileName);
        });
    }
    if (isTemplate(elm)) {
        hmrExternalStyles(elm.content, versionId, cssFileNames);
    }
    if (hasShadowRoot(elm)) {
        hmrExternalStyles(elm.shadowRoot, versionId, cssFileNames);
    }
    if (elm.children) {
        for (let i = 0; i < elm.children.length; i++) {
            hmrExternalStyles(elm.children[i], versionId, cssFileNames);
        }
    }
    return cssFileNames.sort();
};
const hmrStylesheetLink = (styleSheetElm, versionId, cssFileName) => {
    const orgHref = styleSheetElm.getAttribute('href');
    const newHref = getHmrHref(versionId, cssFileName, styleSheetElm.href);
    if (newHref !== orgHref) {
        styleSheetElm.setAttribute('href', newHref);
        setHmrAttr(styleSheetElm, versionId);
    }
};
//# sourceMappingURL=hmr-external-styles.js.map