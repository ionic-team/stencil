import { hasShadowRoot, isElement, isTemplate } from './hmr-util';
export const hmrInlineStyles = (elm, versionId, stylesUpdatedData) => {
    const stylesUpdated = stylesUpdatedData;
    if (isElement(elm) && elm.nodeName.toLowerCase() === 'style') {
        stylesUpdated.forEach((styleUpdated) => {
            hmrStyleElement(elm, versionId, styleUpdated);
        });
    }
    if (isTemplate(elm)) {
        hmrInlineStyles(elm.content, versionId, stylesUpdated);
    }
    if (hasShadowRoot(elm)) {
        hmrInlineStyles(elm.shadowRoot, versionId, stylesUpdated);
    }
    if (elm.children) {
        for (let i = 0; i < elm.children.length; i++) {
            hmrInlineStyles(elm.children[i], versionId, stylesUpdated);
        }
    }
    return stylesUpdated
        .map((s) => s.styleTag)
        .reduce((arr, v) => {
        if (arr.indexOf(v) === -1) {
            arr.push(v);
        }
        return arr;
    }, [])
        .sort();
};
const hmrStyleElement = (elm, versionId, stylesUpdated) => {
    const styleId = elm.getAttribute('sty-id');
    if (styleId === stylesUpdated.styleId && stylesUpdated.styleText) {
        // if we made it this far then it's a match!
        // update the new style text
        elm.innerHTML = stylesUpdated.styleText.replace(/\\n/g, '\n');
        // TODO(STENCIL-958): determine if we need to set this attribute
        elm.setAttribute('data-hmr', versionId);
    }
};
//# sourceMappingURL=hmr-inline-styles.js.map