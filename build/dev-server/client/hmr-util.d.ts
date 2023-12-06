export declare const getHmrHref: (versionId: string, fileName: string, testUrl: string) => string;
export declare const setQueryString: (url: string, qsKey: string, qsValue: string) => string;
export declare const setHmrQueryString: (url: string, versionId: string) => string;
export declare const updateCssUrlValue: (versionId: string, fileName: string, oldCss: string) => string;
/**
 * Determine whether a given element is a `<link>` tag pointing to a stylesheet
 *
 * @param elm the element to check
 * @returns whether or not the element is a link stylesheet
 */
export declare const isLinkStylesheet: (elm: Element) => boolean;
/**
 * Determine whether or not a given element is a template element
 *
 * @param elm the element to check
 * @returns whether or not the element of interest is a template element
 */
export declare const isTemplate: (elm: Element) => boolean;
/**
 * Set a new hmr version ID into the `data-hmr` attribute on an element.
 *
 * @param elm the element on which to set the property
 * @param versionId a new HMR version id
 */
export declare const setHmrAttr: (elm: Element, versionId: string) => void;
/**
 * Determine whether or not an element has a shadow root
 *
 * @param elm the element to check
 * @returns whether or not it has a shadow root
 */
export declare const hasShadowRoot: (elm: Element) => boolean;
/**
 * Determine whether or not an element is an element node
 *
 * @param elm the element to check
 * @returns whether or not it is an element node
 */
export declare const isElement: (elm: Element) => boolean;
