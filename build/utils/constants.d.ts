export declare const enum MEMBER_FLAGS {
    String = 1,
    Number = 2,
    Boolean = 4,
    Any = 8,
    Unknown = 16,
    State = 32,
    Method = 64,
    Event = 128,
    Element = 256,
    ReflectAttr = 512,
    Mutable = 1024,
    Prop = 31,
    HasAttribute = 15,
    PropLike = 63
}
export declare const enum EVENT_FLAGS {
    Cancellable = 1,
    Composed = 2,
    Bubbles = 4
}
export declare const enum LISTENER_FLAGS {
    Passive = 1,
    Capture = 2,
    TargetDocument = 4,
    TargetWindow = 8,
    TargetBody = 16,
    /**
     * @deprecated Prevented from new apps, but left in for older collections
     */
    TargetParent = 32
}
export declare const enum HOST_FLAGS {
    hasConnected = 1,
    hasRendered = 2,
    isWaitingForChildren = 4,
    isConstructingInstance = 8,
    isQueuedForUpdate = 16,
    hasInitializedComponent = 32,
    hasLoadedComponent = 64,
    isWatchReady = 128,
    isListenReady = 256,
    needsRerender = 512,
    devOnRender = 1024,
    devOnDidLoad = 2048
}
/**
 * A set of flags used for bitwise calculations against {@link ComponentRuntimeMeta#$flags$}.
 *
 * These flags should only be used in conjunction with {@link ComponentRuntimeMeta#$flags$}.
 * They should _not_ be used for calculations against other fields/numbers
 */
export declare const enum CMP_FLAGS {
    /**
     * Used to determine if a component is using the shadow DOM.
     * e.g. `shadow: true | {}` is set on the `@Component()` decorator
     */
    shadowDomEncapsulation = 1,
    /**
     * Used to determine if a component is using scoped stylesheets
     * e.g. `scoped: true` is set on the `@Component()` decorator
     */
    scopedCssEncapsulation = 2,
    /**
     * Used to determine if a component does not use the shadow DOM _and_ has `<slot/>` tags in its markup.
     */
    hasSlotRelocation = 4,
    /**
     * Determines if a shim for the shadow DOM is necessary.
     *
     * The shim should only be needed if a component requires {@link shadowDomEncapsulation} and if any output
     * target-specific criteria are met. Refer to this flag's usage to determine each output target's criteria.
     */
    needsShadowDomShim = 8,
    /**
     * Determines if `delegatesFocus` is enabled for a component that uses the shadow DOM.
     * e.g. `shadow: { delegatesFocus: true }` is set on the `@Component()` decorator
     */
    shadowDelegatesFocus = 16,
    /**
     * Determines if `mode` is set on the `@Component()` decorator
     */
    hasMode = 32,
    /**
     * Determines if styles must be scoped due to either:
     * 1. A component is using scoped stylesheets ({@link scopedCssEncapsulation})
     * 2. A component is using the shadow DOM _and_ the output target's rules for requiring a shadow DOM shim have been
     * met ({@link needsShadowDomShim})
     */
    needsScopedEncapsulation = 10,
    /**
     * Determines if a component is form-associated or not. This is set based on
     * options passed to the `@Component` decorator.
     */
    formAssociated = 64
}
/**
 * Default style mode id
 */
export declare const DEFAULT_STYLE_MODE = "$";
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
export declare const EMPTY_OBJ: Record<never, never>;
/**
 * Namespaces
 */
export declare const SVG_NS = "http://www.w3.org/2000/svg";
export declare const HTML_NS = "http://www.w3.org/1999/xhtml";
export declare const XLINK_NS = "http://www.w3.org/1999/xlink";
/**
 * File names and value
 */
export declare const COLLECTION_MANIFEST_FILE_NAME = "collection-manifest.json";
/**
 * Constant for the 'copy' output target
 */
export declare const COPY = "copy";
/**
 * Constant for the 'custom' output target
 */
export declare const CUSTOM = "custom";
/**
 * Constant for the 'dist' output target
 */
export declare const DIST = "dist";
/**
 * Constant for the 'dist-collection' output target
 */
export declare const DIST_COLLECTION = "dist-collection";
/**
 * Constant for the 'dist-custom-elements' output target
 */
export declare const DIST_CUSTOM_ELEMENTS = "dist-custom-elements";
/**
 * Constant for the 'dist-types' output target
 */
export declare const DIST_TYPES = "dist-types";
/**
 * Constant for the 'dist-hydrate-script' output target
 */
export declare const DIST_HYDRATE_SCRIPT = "dist-hydrate-script";
/**
 * Constant for the 'dist-lazy' output target
 */
export declare const DIST_LAZY = "dist-lazy";
/**
 * Constant for the 'dist-lazy-loader' output target
 */
export declare const DIST_LAZY_LOADER = "dist-lazy-loader";
/**
 * Constant for the 'dist-global-styles' output target
 */
export declare const DIST_GLOBAL_STYLES = "dist-global-styles";
/**
 * Constant for the 'docs-custom' output target
 */
export declare const DOCS_CUSTOM = "docs-custom";
/**
 * Constant for the 'docs-json' output target
 */
export declare const DOCS_JSON = "docs-json";
/**
 * Constant for the 'docs-readme' output target
 */
export declare const DOCS_README = "docs-readme";
/**
 * Constant for the 'docs-vscode' output target
 */
export declare const DOCS_VSCODE = "docs-vscode";
/**
 * Constant for the 'stats' output target
 */
export declare const STATS = "stats";
/**
 * Constant for the 'www' output target
 */
export declare const WWW = "www";
/**
 * Valid output targets to specify in a Stencil config.
 *
 * Note that there are some output targets (e.g. `DIST_TYPES`) which are
 * programmatically set as output targets by the compiler when other output
 * targets (in that case `DIST`) are set, but which are _not_ supported in a
 * Stencil config. This is enforced in the output target validation code.
 */
export declare const VALID_CONFIG_OUTPUT_TARGETS: readonly ["www", "dist", "dist-collection", "dist-custom-elements", "dist-lazy", "dist-hydrate-script", "docs-json", "docs-readme", "docs-vscode", "docs-custom", "copy", "custom", "stats"];
export declare const GENERATED_DTS = "components.d.ts";
