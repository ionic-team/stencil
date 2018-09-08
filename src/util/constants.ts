
/**
 * Member Types
 */
export const enum MEMBER_TYPE {
  Prop = 1 << 0,
  PropMutable = 1 << 1,
  PropContext = 1 << 2,
  PropConnect = 1 << 3,
  State = 1 << 4,
  Method = 1 << 5,
  Element = 1 << 6,
}


/**
 * Property Types
 */
export const enum PROP_TYPE {
  Unknown = 0,
  Any = 1 << 0,
  String = 1 << 1,
  Boolean = 1 << 2,
  Number = 1 << 3,
}


/**
 * JS Property to Attribute Name Options
 */
export const enum ATTR_CASE {
  LowerCase = 1,
}


/**
 * Priority Levels
 */
export const enum PRIORITY {
  Low = 1,
  Medium = 2,
  High = 3,
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
