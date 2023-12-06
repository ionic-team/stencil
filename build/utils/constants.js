/**
 * Default style mode id
 */
export const DEFAULT_STYLE_MODE = '$';
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
export const EMPTY_OBJ = {};
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
];
export const GENERATED_DTS = 'components.d.ts';
//# sourceMappingURL=constants.js.map