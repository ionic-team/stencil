import { rollupToStencilSourceMap } from '@utils';
import { SourceMap as RollupSourceMap } from 'rollup';
import type * as d from '../../declarations';

describe('sourcemaps', () => {
  describe('rollupToStencilSourceMap', () => {
    it('returns null if the given sourcemap is null', () => {
      expect(rollupToStencilSourceMap(null)).toBeNull();
    });

    it('returns null if the given sourcemap is undefined', () => {
      expect(rollupToStencilSourceMap(undefined)).toBeNull();
    });

    it('transforms a rollup sourcemap to a stencil sourcemap', () => {
      const rollupSourceMap: RollupSourceMap = {
        file: 'index.js',
        mappings: ';;AAAA;AAC9D,GAAG,CAAC,CAAC;AACL;;;;',
        names: ['bootstrapLazy'],
        sources: ['"@lazy-external-entrypoint?app-data=conditional"'],
        sourcesContent: [
          '/*\\n Stencil Client Patch Esm v0.0.0-dev.20210825190806 | MIT Licensed | https://stenciljs.com\\n */',
        ],
        version: 3,
        toString: () => 'stub',
        toUrl: () => 'stub',
      };

      const stencilSourceMap: d.SourceMap = rollupToStencilSourceMap(rollupSourceMap);

      const expectedSourceMap: d.SourceMap = {
        file: 'index.js',
        mappings: ';;AAAA;AAC9D,GAAG,CAAC,CAAC;AACL;;;;',
        names: ['bootstrapLazy'],
        sources: ['"@lazy-external-entrypoint?app-data=conditional"'],
        sourcesContent: [
          '/*\\n Stencil Client Patch Esm v0.0.0-dev.20210825190806 | MIT Licensed | https://stenciljs.com\\n */',
        ],
        version: 3,
      };
      expect(stencilSourceMap).toEqual(expectedSourceMap);
    });
  });
});
