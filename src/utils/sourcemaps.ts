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
