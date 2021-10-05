import { getSourceMappingUrlLinker, getSourceMappingUrlForEndOfFile, rollupToStencilSourceMap } from '@utils';
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

  describe('getSourceMappingUrlLinker', () => {
    it('returns a correctly formatted url', () => {
      expect(getSourceMappingUrlLinker('some-pkg')).toBe('//# sourceMappingURL=some-pkg');
    });

    it('handles question marks in URLs', () => {
      expect(getSourceMappingUrlLinker('some-pkg?')).toBe('//# sourceMappingURL=some-pkg%3F');
    });

    it('handles equal signs in URLs', () => {
      expect(getSourceMappingUrlLinker('some-pkg=')).toBe('//# sourceMappingURL=some-pkg%3D');
    });

    it('handles ampersands in URLs', () => {
      expect(getSourceMappingUrlLinker('some-pkg&')).toBe('//# sourceMappingURL=some-pkg%26');
    });

    it('handles slashes in URLs', () => {
      expect(getSourceMappingUrlLinker('some-pkg/')).toBe('//# sourceMappingURL=some-pkg%2F');
    });

    it('handles exclamation points in URLs', () => {
      expect(getSourceMappingUrlLinker('some-pkg!')).toBe('//# sourceMappingURL=some-pkg%21');
    });

    it('handles single quotes in URLs', () => {
      expect(getSourceMappingUrlLinker("some-'pkg'")).toBe('//# sourceMappingURL=some-%27pkg%27');
    });

    it('handles parenthesis in URLs', () => {
      expect(getSourceMappingUrlLinker('some-(pkg)')).toBe('//# sourceMappingURL=some-%28pkg%29');
    });

    it('handles asterisks in URLs', () => {
      expect(getSourceMappingUrlLinker('some-pkg*')).toBe('//# sourceMappingURL=some-pkg%2a');
    });

    it('encodes multiple disallowed characters at once', () => {
      expect(getSourceMappingUrlLinker('!some-(pkg)*')).toBe('//# sourceMappingURL=%21some-%28pkg%29%2a');
    });
  });

  describe('getSourceMappingUrlLinkerWithNewline', () => {
    it('returns a correctly formatted url', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg')).toBe('\n//# sourceMappingURL=some-pkg.map');
    });

    it('returns a correctly formatted url', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg')).toBe('\n//# sourceMappingURL=some-pkg.map');
    });

    it('handles question marks in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg?')).toBe('\n//# sourceMappingURL=some-pkg%3F.map');
    });

    it('handles equal signs in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg=')).toBe('\n//# sourceMappingURL=some-pkg%3D.map');
    });

    it('handles ampersands in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg&')).toBe('\n//# sourceMappingURL=some-pkg%26.map');
    });

    it('handles slashes in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg/')).toBe('\n//# sourceMappingURL=some-pkg%2F.map');
    });

    it('handles exclamation points in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg!')).toBe('\n//# sourceMappingURL=some-pkg%21.map');
    });

    it('handles single quotes in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile("some-'pkg'")).toBe('\n//# sourceMappingURL=some-%27pkg%27.map');
    });

    it('handles parenthesis in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-(pkg)')).toBe('\n//# sourceMappingURL=some-%28pkg%29.map');
    });

    it('handles asterisks in URLs', () => {
      expect(getSourceMappingUrlForEndOfFile('some-pkg*')).toBe('\n//# sourceMappingURL=some-pkg%2a.map');
    });

    it('encodes multiple disallowed characters at once', () => {
      expect(getSourceMappingUrlForEndOfFile('!some-(pkg)*')).toBe('\n//# sourceMappingURL=%21some-%28pkg%29%2a.map');
    });
  });
});
