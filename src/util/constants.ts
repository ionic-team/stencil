/**
 * This constants file is largely for minification tricks, and to
 * have easy to read variable names. Enums would make more sense
 * in most cases, but doing values like this as constants allows
 * minifiers to just place the raw value directly in source, and in
 * production there is no variable at all. For example, the minifier
 * turns data[BUNDLE_ID] turns into data[0] for production builds.
 */


/**
 * Prop Change Meta Indexes
 */
export const PROP_CHANGE_PROP_NAME = 0;
export const PROP_CHANGE_METHOD_NAME = 1;


/**
 * Property Types
 */
export const TYPE_ANY = 0;
export const TYPE_BOOLEAN = 1;
export const TYPE_NUMBER = 2;


/**
 * JS Property to Attribute Name Options
 */
export const ATTR_DASH_CASE = 0;
export const ATTR_LOWER_CASE = 1;


/**
 * Priority Levels
 */
export const PRIORITY_HIGH = 3;
export const PRIORITY_MEDIUM = 2;
export const PRIORITY_LOW = 1;


/**
 * Slot Meta
 */
export const SLOT_TAG = 0;
export const HAS_SLOTS = 1;
export const HAS_NAMED_SLOTS = 2;


/**
 * SSR Attribute Names
 */
export const SSR_VNODE_ID = 'ssrv';
export const SSR_CHILD_ID = 'ssrc';


/**
 * Node Types
 */
export const ELEMENT_NODE = 1;
export const TEXT_NODE = 3;
export const COMMENT_NODE = 8;


/**
 * Key Name to Key Code Map
 */
export const KEY_CODE_MAP: {[key: string]: number} = {
  'enter': 13,
  'escape': 27,
  'space': 32,
  'tab': 9
};


/**
 * CSS class that gets added to the host element
 * after the component has fully hydrated
 */
export const HYDRATED_CSS = '💎';


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
 * Errors
 */
export const LOAD_BUNDLE_ERROR = 1;
export const QUEUE_EVENTS_ERROR = 2;
export const WILL_LOAD_ERROR = 3;
export const DID_LOAD_ERROR = 4;
export const INIT_INSTANCE_ERROR = 5;
export const RENDER_ERROR = 6;
export const INITIAL_LOAD_ERROR = 7;
