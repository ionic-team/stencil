import { isTsFile } from '../resolve-utils';

describe('resolve-utils', () => {
  describe('isTsFile', () => {
    it('should return true for .ts files', () => {
      expect(isTsFile('.ts')).toEqual(true);
      expect(isTsFile('foo.ts')).toEqual(true);
      expect(isTsFile('foo.bar.ts')).toEqual(true);
      expect(isTsFile('foo/bar.ts')).toEqual(true);
    });

    it('returns false for .tsx files', () => {
      expect(isTsFile('.tsx')).toEqual(false);
      expect(isTsFile('foo.tsx')).toEqual(false);
      expect(isTsFile('foo.bar.tsx')).toEqual(false);
      expect(isTsFile('foo/bar.tsx')).toEqual(false);
    });

    it('should return false for other file extensions', () => {
      expect(isTsFile('foo.js')).toEqual(false);
      expect(isTsFile('foo.doc')).toEqual(false);
      expect(isTsFile('foo.css')).toEqual(false);
      expect(isTsFile('foo.html')).toEqual(false);
    });

    it('should return false for .d.ts and .d.tsx files', () => {
      expect(isTsFile('foo/bar.d.ts')).toEqual(false);
      expect(isTsFile('foo/bar.d.tsx')).toEqual(false);
    });

    it('should return true for spec.ts files', () => {
      expect(isTsFile('spec.ts')).toEqual(true);
    });

    it('is case-sensitive', () => {
      expect(isTsFile('Foo.tS')).toEqual(false);
      expect(isTsFile('Foo.Ts')).toEqual(false);
      expect(isTsFile('Foo.TS')).toEqual(false);
    });
  });
});
