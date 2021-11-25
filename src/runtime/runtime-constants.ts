export const enum VNODE_FLAGS {
  isSlotReference = 1 << 0,

  // slot element has fallback content
  // still create an element that "mocks" the slot element
  isSlotFallback = 1 << 1,

  // slot element does not have fallback content
  // create an html comment we'll use to always reference
  // where actual slot content should sit next to
  isHost = 1 << 2,
}

export const enum PROXY_FLAGS {
  isElementConstructor = 1 << 0,
  proxyState = 1 << 1,
}

export const enum PLATFORM_FLAGS {
  // designates a node in the DOM as being actively moved by the runtime
  isTmpDisconnected = 1 << 0,
  appLoaded = 1 << 1,
  queueSync = 1 << 2,

  queueMask = appLoaded | queueSync,
}

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
