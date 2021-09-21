import type * as d from '../declarations';
import type { SourceMap as RollupSourceMap } from 'rollup';

/**
 * Converts a rollup provided source map to one that Stencil can easily understand
 * @param rollupSourceMap the sourcemap to transform
 * @returns the transformed sourcemap
 */
export const rollupToStencilSourceMap = (rollupSourceMap: RollupSourceMap | undefined): d.SourceMap => {
  if (!rollupSourceMap) {
    return null;
  }

  return {
    file: rollupSourceMap.file,
    mappings: rollupSourceMap.mappings,
    names: rollupSourceMap.names,
    sources: rollupSourceMap.sources,
    sourcesContent: rollupSourceMap.sourcesContent,
    version: rollupSourceMap.version,
  };
};

/**
 * A JavaScript formatted string used to link generated code back to the original. This string follows the guidelines
 * found in the [Linking generated code to source maps](https://sourcemaps.info/spec.html#h.lmz475t4mvbx) section of
 * the Sourcemaps V3 specification proposal.
 */
const JS_SOURCE_MAPPING_URL_LINKER = '//# sourceMappingURL=';

/**
 * Generates a string used to link generated code with the original source, to be placed at the end of the generated
 * code. Note that at this time, this method is _not_ RFC3986 compliant.
 * @param url the url of the source map
 * @returns a linker string, of the format {@link JS_SOURCE_MAPPING_URL_LINKER}=<url>
 */
export const getSourceMappingUrlLinker = (url: string): string => {
  return `${JS_SOURCE_MAPPING_URL_LINKER}${url}`;
};

/**
 * Generates a string used to link generated code with the original source, to be placed at the end of the generated
 * code. This function prepends a newline to the string.
 * @param url the url of the source map
 * @returns a linker string, of the format {@link JS_SOURCE_MAPPING_URL_LINKER}=<url>.map, prepended with a newline
 */
export const getSourceMappingUrlForEndOfFile = (url: string): string => {
  return `\n${getSourceMappingUrlLinker(url)}.map`;
};
