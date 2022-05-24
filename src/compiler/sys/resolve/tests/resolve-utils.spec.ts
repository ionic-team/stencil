import { isJsFile, isTsFile } from '../resolve-utils';

describe('resolve-utils', () => {
  describe('isTsFile', () => {
    it.each(['.ts', 'foo.ts', 'foo.bar.ts', 'foo/bar.ts'])(
      'returns true for a file ending with .ts (%s)',
      (fileName) => {
        expect(isTsFile(fileName)).toEqual(true);
      }
    );

    it.each(['.tsx', 'foo.tsx', 'foo.bar.tsx', 'foo/bar.tsx'])(
      'returns false for a file ending with .tsx (%s)',
      (fileName) => {
        expect(isTsFile(fileName)).toEqual(false);
      }
    );

    it.each(['foo.js', 'foo.doc', 'foo.css', 'foo.html'])(
      'returns false for other a file with another extension (%s)',
      (fileName) => {
        expect(isTsFile(fileName)).toEqual(false);
      }
    );

    it('returns false for .d.ts and .d.tsx files', () => {
      expect(isTsFile('foo/bar.d.ts')).toEqual(false);
      expect(isTsFile('foo/bar.d.tsx')).toEqual(false);
    });

    it('returns true for a file named "spec.ts"', () => {
      expect(isTsFile('spec.ts')).toEqual(true);
    });

    it('returns true for a file named "d.ts"', () => {
      expect(isTsFile('d.ts')).toEqual(true);
    });

    it.each(['foo.tS', 'foo.Ts', 'foo.TS', 'foo.d.Ts', 'foo.d.tS', 'foo.d.TS', 'foo.D.TS'])(
      'returns false for non-lowercase extensions (%s)',
      (fileName) => {
        expect(isTsFile(fileName)).toEqual(false);
      }
    );
  });

  describe('isJsFile', () => {
    it('should return true for regular .js files', () => {
      expect(isJsFile('.js')).toEqual(true);
      expect(isJsFile('foo.js')).toEqual(true);
      expect(isJsFile('foo/bar.js')).toEqual(true);
      expect(isJsFile('spec.js')).toEqual(true);
    });

    it('should return false for other file extentions', () => {
      expect(isJsFile('.jsx')).toEqual(false);
      expect(isJsFile('foo.txt')).toEqual(false);
      expect(isJsFile('foo/bar.css')).toEqual(false);
    });

    it('should return false for .spec.js and .spec.jsx files', () => {
      expect(isJsFile('.spec.js')).toEqual(false);
      expect(isJsFile('foo.spec.js')).toEqual(false);
      expect(isJsFile('foo/bar.spec.js')).toEqual(false);
    });

    it('should be case insenitive', () => {
      expect(isJsFile('.Js')).toEqual(true);
      expect(isJsFile('foo.JS')).toEqual(true);
      expect(isJsFile('foo/bar.jS')).toEqual(true);
    });
  });
});
