/**
 * Bit flags for recording various properties of VDom nodes
 */
export const enum VNODE_FLAGS {
  /**
   * Whether or not a vdom node is a slot reference
   */
  isSlotReference = 1 << 0,

  /**
   * Whether or not a slot element has fallback content
   */
  isSlotFallback = 1 << 1,

  /**
   * Whether or not an element is a host element
   */
  isHost = 1 << 2,
}

export const enum PROXY_FLAGS {
  isElementConstructor = 1 << 0,
  proxyState = 1 << 1,
}

export const enum PLATFORM_FLAGS {
  /**
   * designates a node in the DOM as being actively moved by the runtime
   */
  isTmpDisconnected = 1 << 0,
  appLoaded = 1 << 1,
  queueSync = 1 << 2,

  queueMask = appLoaded | queueSync,
}

/**
 * A (subset) of node types which are relevant for the Stencil runtime. These
 * values are based on the values which can possibly be returned by the
 * `.nodeType` property of a DOM node. See here for details:
 *
 * {@link https://dom.spec.whatwg.org/#ref-for-dom-node-nodetype%E2%91%A0}
 */
export const enum NODE_TYPE {
  ElementNode = 1,
  TextNode = 3,
  CommentNode = 8,
  DocumentNode = 9,
  DocumentTypeNode = 10,
  DocumentFragment = 11,
}

export const CONTENT_REF_ID = 'r';
export const ORG_LOCATION_ID = 'o';
export const SLOT_NODE_ID = 's';
export const TEXT_NODE_ID = 't';

export const HYDRATE_ID = 's-id';
export const HYDRATED_STYLE_ID = 'sty-id';
export const HYDRATE_CHILD_ID = 'c-id';
export const HYDRATED_CSS = '{visibility:hidden}.hydrated{visibility:inherit}';

export const XLINK_NS = 'http://www.w3.org/1999/xlink';
