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
export const JS_SOURCE_MAPPING_URL_LINKER = '//# sourceMappingURL=';

/**
 * Generates an RFC-3986 compliant string for the given input.
 * More information about RFC-3986 can be found [here](https://datatracker.ietf.org/doc/html/rfc3986)
 * This function's original source is derived from
 * [MDN's encodeURIComponent documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#description)
 * @param filename the filename to encode
 * @returns the encoded URI
 */
const encodeFilenameToRfc3986 = (filename: string): string => {
  const encodedUri = encodeURIComponent(filename);
  // replace all '!', single quotes, '(', ')', and '*' with their hexadecimal values (UTF-16)
  return encodedUri.replace(/[!'()*]/g, (matchedCharacter) => {
    return '%' + matchedCharacter.charCodeAt(0).toString(16);
  });
};

/**
 * Generates a string used to link generated code with the original source, to be placed at the end of the generated
 * code.
 * @param url the url of the source map
 * @returns a linker string, of the format {@link JS_SOURCE_MAPPING_URL_LINKER}=<url>
 */
export const getSourceMappingUrlLinker = (url: string): string => {
  return `${JS_SOURCE_MAPPING_URL_LINKER}${encodeFilenameToRfc3986(url)}`;
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
