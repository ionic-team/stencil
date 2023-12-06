import type { SourceMap as RollupSourceMap } from 'rollup';
import type * as d from '../declarations';
/**
 * Converts a rollup provided source map to one that Stencil can easily understand
 * @param rollupSourceMap the sourcemap to transform
 * @returns the transformed sourcemap
 */
export declare function rollupToStencilSourceMap(rollupSourceMap: null): null;
export declare function rollupToStencilSourceMap(rollupSourceMap: undefined): null;
export declare function rollupToStencilSourceMap(rollupSourceMap: RollupSourceMap): d.SourceMap;
/**
 * Generates a string used to link generated code with the original source, to be placed at the end of the generated
 * code.
 * @param url the url of the source map
 * @returns a linker string, of the format {@link JS_SOURCE_MAPPING_URL_LINKER}=<url>
 */
export declare const getSourceMappingUrlLinker: (url: string) => string;
/**
 * Generates a string used to link generated code with the original source, to be placed at the end of the generated
 * code as an inline source map.
 * @param sourceMapContents the sourceMapContents of the source map
 * @returns a linker string, of the format {@link JS_SOURCE_MAPPING_URL_LINKER}<dataUriPrefixAndMime><sourceMapContents>
 */
export declare const getInlineSourceMappingUrlLinker: (sourceMapContents: string) => string;
/**
 * Generates a string used to link generated code with the original source, to be placed at the end of the generated
 * code. This function prepends a newline to the string.
 * @param url the url of the source map
 * @returns a linker string, of the format {@link JS_SOURCE_MAPPING_URL_LINKER}=<url>.map, prepended with a newline
 */
export declare const getSourceMappingUrlForEndOfFile: (url: string) => string;
