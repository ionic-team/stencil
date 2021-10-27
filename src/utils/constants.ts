export const enum MEMBER_FLAGS {
  String = 1 << 0,
  Number = 1 << 1,
  Boolean = 1 << 2,
  Any = 1 << 3,
  Unknown = 1 << 4,

  State = 1 << 5,
  Method = 1 << 6,
  Event = 1 << 7,
  Element = 1 << 8,

  ReflectAttr = 1 << 9,
  Mutable = 1 << 10,

  Prop = String | Number | Boolean | Any | Unknown,
  HasAttribute = String | Number | Boolean | Any,
  PropLike = Prop | State,
}

export const enum EVENT_FLAGS {
  Cancellable = 1 << 0,
  Composed = 1 << 1,
  Bubbles = 1 << 2,
}

export const enum LISTENER_FLAGS {
  Passive = 1 << 0,
  Capture = 1 << 1,

  TargetDocument = 1 << 2,
  TargetWindow = 1 << 3,
  TargetBody = 1 << 4,

  /**
   * @deprecated Prevented from new apps, but left in for older collections
   */
  TargetParent = 1 << 5,
}

export const enum HOST_FLAGS {
  hasConnected = 1 << 0,
  hasRendered = 1 << 1,
  isWaitingForChildren = 1 << 2,
  isConstructingInstance = 1 << 3,
  isQueuedForUpdate = 1 << 4,
  hasInitializedComponent = 1 << 5,
  hasLoadedComponent = 1 << 6,
  isWatchReady = 1 << 7,
  isListenReady = 1 << 8,
  needsRerender = 1 << 9,

  // DEV ONLY
  devOnRender = 1 << 10,
  devOnDidLoad = 1 << 11,
}

export const enum CMP_FLAGS {
  shadowDomEncapsulation = 1 << 0,
  scopedCssEncapsulation = 1 << 1,
  hasSlotRelocation = 1 << 2,
  needsShadowDomShim = 1 << 3,
  shadowDelegatesFocus = 1 << 4,
  hasMode = 1 << 5,
  needsScopedEncapsulation = scopedCssEncapsulation | needsShadowDomShim,
}

/**
 * Default style mode id
 */
export const DEFAULT_STYLE_MODE = '$';

/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
export const EMPTY_OBJ: any = {};

/**
 * Namespaces
 */
export const SVG_NS = 'http://www.w3.org/2000/svg';
export const HTML_NS = 'http://www.w3.org/1999/xhtml';
export const XLINK_NS = 'http://www.w3.org/1999/xlink';
export const XML_NS = 'http://www.w3.org/XML/1998/namespace';

/**
 * File names and value
 */
export const COLLECTION_MANIFEST_FILE_NAME = 'collection-manifest.json';
