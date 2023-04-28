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
  // TODO(STENCIL-662): Remove code related to deprecated shadowDomShim field
  // Note that when we remove this field we should consider whether we need to
  // retain a placeholder here, since if we want to have compatability between
  // different versions of the runtime then we'll need to not shift the values
  // of the other higher flags down
  needsShadowDomShim = 1 << 3,
  shadowDelegatesFocus = 1 << 4,
  hasMode = 1 << 5,
  // TODO(STENCIL-662): Remove code related to deprecated shadowDomShim field
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

/**
 * File names and value
 */
export const COLLECTION_MANIFEST_FILE_NAME = 'collection-manifest.json';

/**
 * Constant for the 'copy' output target
 */
export const COPY = 'copy';
/**
 * Constant for the 'custom' output target
 */
export const CUSTOM = 'custom';
/**
 * Constant for the 'dist' output target
 */
export const DIST = 'dist';
/**
 * Constant for the 'dist-collection' output target
 */
export const DIST_COLLECTION = 'dist-collection';
/**
 * Constant for the 'dist-custom-elements' output target
 */
export const DIST_CUSTOM_ELEMENTS = 'dist-custom-elements';

/**
 * Constant for the 'dist-types' output target
 */
export const DIST_TYPES = 'dist-types';
/**
 * Constant for the 'dist-hydrate-script' output target
 */
export const DIST_HYDRATE_SCRIPT = 'dist-hydrate-script';
/**
 * Constant for the 'dist-lazy' output target
 */
export const DIST_LAZY = 'dist-lazy';
/**
 * Constant for the 'dist-lazy-loader' output target
 */
export const DIST_LAZY_LOADER = 'dist-lazy-loader';
/**
 * Constant for the 'dist-global-styles' output target
 */
export const DIST_GLOBAL_STYLES = 'dist-global-styles';
/**
 * Constant for the 'docs-custom' output target
 */
export const DOCS_CUSTOM = 'docs-custom';
/**
 * Constant for the 'docs-json' output target
 */
export const DOCS_JSON = 'docs-json';
/**
 * Constant for the 'docs-readme' output target
 */
export const DOCS_README = 'docs-readme';
/**
 * Constant for the 'docs-vscode' output target
 */
export const DOCS_VSCODE = 'docs-vscode';
/**
 * Constant for the 'stats' output target
 */
export const STATS = 'stats';
/**
 * Constant for the 'www' output target
 */
export const WWW = 'www';

/**
 * Valid output targets to specify in a Stencil config.
 *
 * Note that there are some output targets (e.g. `DIST_TYPES`) which are
 * programmatically set as output targets by the compiler when other output
 * targets (in that case `DIST`) are set, but which are _not_ supported in a
 * Stencil config. This is enforced in the output target validation code.
 */
export const VALID_CONFIG_OUTPUT_TARGETS = [
  // DIST
  WWW,
  DIST,
  DIST_COLLECTION,
  DIST_CUSTOM_ELEMENTS,
  DIST_LAZY,
  DIST_HYDRATE_SCRIPT,

  // DOCS
  DOCS_JSON,
  DOCS_README,
  DOCS_VSCODE,
  DOCS_CUSTOM,

  // MISC
  COPY,
  CUSTOM,
  STATS,
] as const;

export const GENERATED_DTS = 'components.d.ts';
