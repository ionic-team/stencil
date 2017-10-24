
/**
 * Member Types
 */
export const enum MEMBER_TYPE {
  Prop = 1,
  PropMutable = 2,
  PropContext = 3,
  PropConnect = 4,
  State = 5,
  Method = 6,
  Element = 7,
}


/**
 * Prop Change Meta Indexes
 */
export const enum PROP_CHANGE {
  PropName = 0,
  MethodName = 1,
}


/**
 * Property Types
 */
export const enum PROP_TYPE {
  Unknown = 0,
  Any = 1,
  String = 2,
  Boolean = 3,
  Number = 4,
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
 * Slot Meta
 */
export const enum SLOT_META {
  NoSlots = 0,
  HasSlots = 1,
  HasNamedSlots = 2,
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
 */
export const enum NODE_TYPE {
  ElementNode = 1,
  TextNode = 3,
  CommentNode = 8,
}


/**
 * SSR Attribute Names
 */
export const SSR_VNODE_ID = 'data-ssrv';
export const SSR_CHILD_ID = 'data-ssrc';


export const DEFAULT_STYLE_MODE = '$';

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
export const CORE_NAME = 'core';
export const GLOBAL_NAME = 'global';
export const LOADER_NAME = 'loader';
export const APP_NAMESPACE_REGEX = /["']__STENCIL__APP__['"]/g;


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
