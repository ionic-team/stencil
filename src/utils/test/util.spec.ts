import { mockConfig } from '@stencil/core/testing';
import * as util from '../util';

describe('util', () => {
  describe('generatePreamble', () => {
    it('generates a comment with a single line preamble', () => {
      const testConfig = mockConfig();
      testConfig.preamble = 'I am Stencil';

      const result = util.generatePreamble(testConfig);

      expect(result).toBe(`/*!
 * I am Stencil
 */`);
    });

    it('generates a comment with a multi-line preamble', () => {
      const testConfig = mockConfig();
      testConfig.preamble = 'I am Stencil\nHear me roar';

      const result = util.generatePreamble(testConfig);

      expect(result).toBe(`/*!
 * I am Stencil
 * Hear me roar
 */`);
    });

    it('returns an empty string if no preamble is provided', () => {
      const testConfig = mockConfig();

      const result = util.generatePreamble(testConfig);

      expect(result).toBe('');
    });

    it('returns an empty string a null preamble is provided', () => {
      const testConfig = mockConfig();
      testConfig.preamble = null;

      const result = util.generatePreamble(testConfig);

      expect(result).toBe('');
    });

    it('returns an empty string if an empty preamble is provided', () => {
      const testConfig = mockConfig();
      testConfig.preamble = '';

      const result = util.generatePreamble(testConfig);

      expect(result).toBe('');
    });
  });

  describe('isDtsFile', () => {
    it('should return true for .d.ts files', () => {
      expect(util.isDtsFile('.d.ts')).toEqual(true);
      expect(util.isDtsFile('foo.d.ts')).toEqual(true);
      expect(util.isDtsFile('foo/bar.d.ts')).toEqual(true);
    });

    it('should return false for all other file types', () => {
      expect(util.isDtsFile('.k.ts')).toEqual(false);
      expect(util.isDtsFile('foo.d.doc')).toEqual(false);
      expect(util.isDtsFile('foo/bar.txt')).toEqual(false);
      expect(util.isDtsFile('foo.spec.ts')).toEqual(false);
    });

    it('should be case insensitive', () => {
      expect(util.isDtsFile('foo/bar.D.tS')).toEqual(true);
    });
  });

  describe('isJsFile', () => {
    it('should return true for regular .js files', () => {
      expect(util.isJsFile('.js')).toEqual(true);
      expect(util.isJsFile('foo.js')).toEqual(true);
      expect(util.isJsFile('foo/bar.js')).toEqual(true);
      expect(util.isJsFile('spec.js')).toEqual(true);
    });

    it('should return false for other file extentions', () => {
      expect(util.isJsFile('.jsx')).toEqual(false);
      expect(util.isJsFile('foo.txt')).toEqual(false);
      expect(util.isJsFile('foo/bar.css')).toEqual(false);
    });

    it('should return false for .spec.js and .spec.jsx files', () => {
      expect(util.isJsFile('.spec.js')).toEqual(false);
      expect(util.isJsFile('foo.spec.js')).toEqual(false);
      expect(util.isJsFile('foo/bar.spec.js')).toEqual(false);
    });

    it('should be case insenitive', () => {
      expect(util.isJsFile('.Js')).toEqual(true);
      expect(util.isJsFile('foo.JS')).toEqual(true);
      expect(util.isJsFile('foo/bar.jS')).toEqual(true);
    });
  });

  it('createJsVarName', () => {
    expect(util.createJsVarName('./scoped-style-import.css?tag=my-button&encapsulation=scoped')).toBe(
      'scopedStyleImportCss'
    );
    expect(util.createJsVarName('./scoped-style-import.css#hash')).toBe('scopedStyleImportCss');
    expect(util.createJsVarName('./scoped-style-import.css&data')).toBe('scopedStyleImportCss');
    expect(util.createJsVarName('./scoped-style-import.css=data')).toBe('scopedStyleImportCss');
    expect(util.createJsVarName('@ionic/core')).toBe('ionicCore');
    expect(util.createJsVarName('@ionic\\core')).toBe('ionicCore');
    expect(util.createJsVarName('88mph')).toBe('_88mph');
    expect(util.createJsVarName('Doc.brown&')).toBe('docBrown');
    expect(util.createJsVarName('  Doc!  Brown?  ')).toBe('docBrown');
    expect(util.createJsVarName('doc---Brown')).toBe('docBrown');
    expect(util.createJsVarName('doc-brown')).toBe('docBrown');
    expect(util.createJsVarName('DocBrown')).toBe('docBrown');
    expect(util.createJsVarName('Doc')).toBe('doc');
    expect(util.createJsVarName('doc')).toBe('doc');
    expect(util.createJsVarName('AB')).toBe('aB');
    expect(util.createJsVarName('Ab')).toBe('ab');
    expect(util.createJsVarName('a')).toBe('a');
    expect(util.createJsVarName('A')).toBe('a');
    expect(util.createJsVarName('    ')).toBe('');
    expect(util.createJsVarName('')).toBe('');
    expect(util.createJsVarName(null)).toBe(null);
  });
});
