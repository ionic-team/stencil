export const getHmrHref = (versionId, fileName, testUrl) => {
    if (typeof testUrl === 'string' && testUrl.trim() !== '') {
        if (getUrlFileName(fileName) === getUrlFileName(testUrl)) {
            // only compare by filename w/out querystrings, not full path
            return setHmrQueryString(testUrl, versionId);
        }
    }
    return testUrl;
};
const getUrlFileName = (url) => {
    // not using URL because IE11 doesn't support it
    const splt = url.split('/');
    return splt[splt.length - 1].split('&')[0].split('?')[0];
};
const parseQuerystring = (oldQs) => {
    const newQs = {};
    if (typeof oldQs === 'string') {
        oldQs.split('&').forEach((kv) => {
            const splt = kv.split('=');
            newQs[splt[0]] = splt[1] ? splt[1] : '';
        });
    }
    return newQs;
};
const stringifyQuerystring = (qs) => Object.keys(qs)
    .map((key) => key + '=' + qs[key])
    .join('&');
export const setQueryString = (url, qsKey, qsValue) => {
    // not using URL because IE11 doesn't support it
    const urlSplt = url.split('?');
    const urlPath = urlSplt[0];
    const qs = parseQuerystring(urlSplt[1]);
    qs[qsKey] = qsValue;
    return urlPath + '?' + stringifyQuerystring(qs);
};
export const setHmrQueryString = (url, versionId) => setQueryString(url, 's-hmr', versionId);
export const updateCssUrlValue = (versionId, fileName, oldCss) => {
    const reg = /url\((['"]?)(.*)\1\)/gi;
    let result;
    let newCss = oldCss;
    while ((result = reg.exec(oldCss)) !== null) {
        const url = result[2];
        newCss = newCss.replace(url, getHmrHref(versionId, fileName, url));
    }
    return newCss;
};
/**
 * Determine whether a given element is a `<link>` tag pointing to a stylesheet
 *
 * @param elm the element to check
 * @returns whether or not the element is a link stylesheet
 */
export const isLinkStylesheet = (elm) => elm.nodeName.toLowerCase() === 'link' &&
    !!elm.href &&
    !!elm.rel &&
    elm.rel.toLowerCase() === 'stylesheet';
/**
 * Determine whether or not a given element is a template element
 *
 * @param elm the element to check
 * @returns whether or not the element of interest is a template element
 */
export const isTemplate = (elm) => elm.nodeName.toLowerCase() === 'template' &&
    !!elm.content &&
    elm.content.nodeType === 11 /* NODE_TYPE.DocumentFragment */;
/**
 * Set a new hmr version ID into the `data-hmr` attribute on an element.
 *
 * @param elm the element on which to set the property
 * @param versionId a new HMR version id
 */
export const setHmrAttr = (elm, versionId) => {
    // TODO(STENCIL-958): determine if we need to set this attribute
    elm.setAttribute('data-hmr', versionId);
};
/**
 * Determine whether or not an element has a shadow root
 *
 * @param elm the element to check
 * @returns whether or not it has a shadow root
 */
export const hasShadowRoot = (elm) => !!elm.shadowRoot && elm.shadowRoot.nodeType === 11 /* NODE_TYPE.DocumentFragment */ && elm.shadowRoot !== elm;
/**
 * Determine whether or not an element is an element node
 *
 * @param elm the element to check
 * @returns whether or not it is an element node
 */
export const isElement = (elm) => !!elm && elm.nodeType === 1 /* NODE_TYPE.ElementNode */ && !!elm.getAttribute;
//# sourceMappingURL=hmr-util.js.map