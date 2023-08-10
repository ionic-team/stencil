import { hasSrcDirectoryInclude } from '../typescript-config';

describe('typescript-config', () => {
  describe('hasSrcDirectoryInclude', () => {
    it('returns `false` for a non-array argument', () => {
      // the intent of this test is to evaluate when a user doesn't provide an array, hence the type assertion
      expect(hasSrcDirectoryInclude('src' as unknown as string[], 'src')).toBe(false);
    });

    it('returns `false` for an empty array', () => {
      expect(hasSrcDirectoryInclude([], 'src/')).toBe(false);
    });

    it('returns `false` when an entry does not exist in the array', () => {
      expect(hasSrcDirectoryInclude(['src'], 'source')).toBe(false);
    });

    it('returns `true` when an entry does exist in the array', () => {
      expect(hasSrcDirectoryInclude(['src', 'foo'], 'src')).toBe(true);
    });

    it('returns `true` for globs', () => {
      expect(hasSrcDirectoryInclude(['src/**/*.ts', 'foo/'], 'src/**/*.ts')).toBe(true);
    });

    it.each([
      [['src'], './src'],
      [['./src'], 'src'],
      [['../src'], '../src'],
      [['*'], './*'],
    ])('returns `true` for relative paths', (includedPaths, srcDir) => {
      expect(hasSrcDirectoryInclude(includedPaths, srcDir)).toBe(true);
    });
  });
});
