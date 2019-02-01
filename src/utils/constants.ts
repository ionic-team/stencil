
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
  Disabled = 1 << 1,
  Capture = 1 << 2,

  TargetDocument = 1 << 3,
  TargetWindow = 1 << 4,
  TargetParent = 1 << 5,
  TargetBody = 1 << 6,
}


/**
 * Member Types
 */
export const enum MEMBER_TYPE {
  Prop = MEMBER_FLAGS.Prop,
  State = MEMBER_FLAGS.State,
  Method = MEMBER_FLAGS.Method,
  Element = MEMBER_FLAGS.Element,
  Event = MEMBER_FLAGS.Event,
}


/**
 * Property Types
 */
export const enum PROP_TYPE {
  Unknown = MEMBER_FLAGS.Unknown,
  Any = MEMBER_FLAGS.Any,
  String = MEMBER_FLAGS.String,
  Boolean = MEMBER_FLAGS.Boolean,
  Number = MEMBER_FLAGS.Number,
}


/**
 * Encapsulation
 */
export const enum ENCAPSULATION {
  NoEncapsulation = 0,
  ShadowDom = 1,
  ScopedCss = 2,
}


/**
 * Node Types
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 */
export const enum NODE_TYPE {
  ElementNode = 1,
  TextNode = 3,
  CommentNode = 8,
  DocumentNode = 9,
  DocumentTypeNode = 10,
  DocumentFragment = 11,
}


/**
 * SSR Attribute Names
 */
export const SSR_VNODE_ID = 'ssrv';
export const SSR_CHILD_ID = 'ssrc';


/**
 * Default style mode id
 */
export const DEFAULT_STYLE_MODE = '$';


/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
export const EMPTY_OBJ: any = {};
export const EMPTY_ARR: any[] = [];


/**
 * Key Name to Key Code Map
 */
export const KEY_CODE_MAP: {[key: string]: number} = {
  'enter': 13,
  'escape': 27,
  'space': 32,
  'tab': 9,
  'left' : 37,
  'up' : 38,
  'right' : 39,
  'down' : 40
};


/**
 * Namespaces
 */
export const SVG_NS = 'http://www.w3.org/2000/svg';
export const XLINK_NS = 'http://www.w3.org/1999/xlink';
export const XML_NS = 'http://www.w3.org/XML/1998/namespace';


/**
 * File names and value
 */
export const BANNER = `Built with http://stenciljs.com`;
export const COLLECTION_MANIFEST_FILE_NAME = 'collection-manifest.json';
export const WEB_COMPONENTS_JSON_FILE_NAME = 'web-components.json';
export const APP_NAMESPACE_REGEX = /["']__APP__['"]/g;


/**
 * Runtime Errors
 */
export const enum RUNTIME_ERROR {
  LoadBundleError = 1,
  QueueEventsError = 2,
  WillLoadError = 3,
  DidLoadError = 4,
  WillUpdateError = 5,
  DidUpdateError = 6,
  InitInstanceError = 7,
  RenderError = 8,
}
