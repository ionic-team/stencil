import type * as d from '../declarations';
import type { SourceMap as RollupSourceMap } from 'rollup';

export const rollupSrcMapToObj = (rollupSrcMap: RollupSourceMap): d.SourceMap => {
  if (!rollupSrcMap) return null;
  if (typeof rollupSrcMap.toUrl === 'function') return JSON.parse(rollupSrcMap.toString());
  if (typeof rollupSrcMap === 'string') return JSON.parse(rollupSrcMap);
  return rollupSrcMap;
}
