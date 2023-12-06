/**
 * Bit flags for recording various properties of VDom nodes
 */
export declare const enum VNODE_FLAGS {
    /**
     * Whether or not a vdom node is a slot reference
     */
    isSlotReference = 1,
    /**
     * Whether or not a slot element has fallback content
     */
    isSlotFallback = 2,
    /**
     * Whether or not an element is a host element
     */
    isHost = 4
}
export declare const enum PROXY_FLAGS {
    isElementConstructor = 1,
    proxyState = 2
}
export declare const enum PLATFORM_FLAGS {
    /**
     * designates a node in the DOM as being actively moved by the runtime
     */
    isTmpDisconnected = 1,
    appLoaded = 2,
    queueSync = 4,
    queueMask = 6
}
/**
 * A (subset) of node types which are relevant for the Stencil runtime. These
 * values are based on the values which can possibly be returned by the
 * `.nodeType` property of a DOM node. See here for details:
 *
 * {@link https://dom.spec.whatwg.org/#ref-for-dom-node-nodetype%E2%91%A0}
 */
export declare const enum NODE_TYPE {
    ElementNode = 1,
    TextNode = 3,
    CommentNode = 8,
    DocumentNode = 9,
    DocumentTypeNode = 10,
    DocumentFragment = 11
}
export declare const CONTENT_REF_ID = "r";
export declare const ORG_LOCATION_ID = "o";
export declare const SLOT_NODE_ID = "s";
export declare const TEXT_NODE_ID = "t";
export declare const HYDRATE_ID = "s-id";
export declare const HYDRATED_STYLE_ID = "sty-id";
export declare const HYDRATE_CHILD_ID = "c-id";
export declare const HYDRATED_CSS = "{visibility:hidden}.hydrated{visibility:inherit}";
/**
 * Constant for styles to be globally applied to `slot-fb` elements for pseudo-slot behavior.
 *
 * Two cascading rules must be used instead of a `:not()` selector due to Stencil browser
 * support as of Stencil v4.
 */
export declare const SLOT_FB_CSS = "slot-fb{display:contents}slot-fb[hidden]{display:none}";
export declare const XLINK_NS = "http://www.w3.org/1999/xlink";
export declare const FORM_ASSOCIATED_CUSTOM_ELEMENT_CALLBACKS: readonly ["formAssociatedCallback", "formResetCallback", "formDisabledCallback", "formStateRestoreCallback"];
