
export const enum VNODE_FLAGS {
  isSlotReference = 1 << 0,
  isSlotFallback = 1 << 1,
  isHost = 1 << 2,
}

export const enum NODE_TYPE {
  ElementNode = 1,
  TextNode = 3,
  CommentNode = 8,
  DocumentNode = 9,
  DocumentTypeNode = 10,
  DocumentFragment = 11
}

export const HYDRATE_HOST_ID = 's-id';
export const HYDRATE_CHILD_ID = 'c-id';

export const XLINK_NS = 'http://www.w3.org/1999/xlink';
