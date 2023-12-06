export const CONTENT_REF_ID = 'r';
export const ORG_LOCATION_ID = 'o';
export const SLOT_NODE_ID = 's';
export const TEXT_NODE_ID = 't';
export const HYDRATE_ID = 's-id';
export const HYDRATED_STYLE_ID = 'sty-id';
export const HYDRATE_CHILD_ID = 'c-id';
export const HYDRATED_CSS = '{visibility:hidden}.hydrated{visibility:inherit}';
/**
 * Constant for styles to be globally applied to `slot-fb` elements for pseudo-slot behavior.
 *
 * Two cascading rules must be used instead of a `:not()` selector due to Stencil browser
 * support as of Stencil v4.
 */
export const SLOT_FB_CSS = 'slot-fb{display:contents}slot-fb[hidden]{display:none}';
export const XLINK_NS = 'http://www.w3.org/1999/xlink';
export const FORM_ASSOCIATED_CUSTOM_ELEMENT_CALLBACKS = [
    'formAssociatedCallback',
    'formResetCallback',
    'formDisabledCallback',
    'formStateRestoreCallback',
];
//# sourceMappingURL=runtime-constants.js.map