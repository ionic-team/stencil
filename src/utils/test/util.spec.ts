import type * as d from '../../declarations';
import { mockConfig, mockBuildCtx } from '@stencil/core/testing';
import * as util from '@utils';
import { stubDiagnostic } from '../../dev-server/test/Diagnostic.stub';

describe('util', () => {
  describe('generatePreamble', () => {
    it('generates a comment with a single line preamble', () => {
      const testConfig = mockConfig({ preamble: 'I am Stencil' });

      const result = util.generatePreamble(testConfig);

      expect(result).toBe(`/*!
 * I am Stencil
 */`);
    });

    it('generates a comment with a multi-line preamble', () => {
      const testConfig = mockConfig({ preamble: 'I am Stencil\nHear me roar' });

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
      const testConfig = mockConfig({ preamble: null });

      const result = util.generatePreamble(testConfig);

      expect(result).toBe('');
    });

    it('returns an empty string if an empty preamble is provided', () => {
      const testConfig = mockConfig({ preamble: '' });

      const result = util.generatePreamble(testConfig);

      expect(result).toBe('');
    });
  });

  describe('hasDependency', () => {
    let buildCtx: d.BuildCtx;

    beforeEach(() => {
      buildCtx = mockBuildCtx();
    });

    it("returns false when the packageJson field isn't set on the build context", () => {
      buildCtx.packageJson = null;

      expect(util.hasDependency(buildCtx, 'a-non-existent-pkg')).toBe(false);
    });

    it('returns false if a project has no dependencies', () => {
      buildCtx.packageJson.dependencies = null;

      expect(util.hasDependency(buildCtx, 'a-non-existent-pkg')).toBe(false);
    });

    it('returns false if a project has an empty list of dependencies', () => {
      buildCtx.packageJson.dependencies = {};

      expect(util.hasDependency(buildCtx, 'a-non-existent-pkg')).toBe(false);
    });

    it("returns false for '@stencil/core'", () => {
      buildCtx.packageJson.dependencies = { '@stencil/core': '2.0.0' };

      expect(util.hasDependency(buildCtx, '@stencil/core')).toBe(false);
    });

    it('returns true for a dependency match', () => {
      buildCtx.packageJson.dependencies = {
        'existent-pkg1': '1.0.0',
        'existent-pkg2': '2.0.0',
        'existent-pkg3': '3.0.0',
      };

      expect(util.hasDependency(buildCtx, 'existent-pkg2')).toBe(true);
    });

    it('is case sensitive in its lookup', () => {
      buildCtx.packageJson.dependencies = {
        'existent-pkg1': '1.0.0',
        'existent-pkg2': '2.0.0',
        'existent-pkg3': '3.0.0',
      };

      expect(util.hasDependency(buildCtx, 'EXISTENT-PKG2')).toBe(false);
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

  describe('parsePackageJson', () => {
    const mockPackageJsonPath = '/mock/path/package.json';

    it('returns a parse error if parsing cannot complete', () => {
      // improperly formatted JSON - note the lack of ':'
      const diagnostic = util.parsePackageJson('{ "someJson" "value"}', mockPackageJsonPath);

      const expectedDiagnostic: d.Diagnostic = stubDiagnostic({
        absFilePath: mockPackageJsonPath,
        header: 'Error Parsing JSON',
        messageText: 'Unexpected string in JSON at position 13', // due to missing colon in input
        type: 'build',
      });

      expect(diagnostic).toEqual<util.ParsePackageJsonResult>({
        diagnostic: expectedDiagnostic,
        data: null,
        filePath: mockPackageJsonPath,
      });
    });

    it('returns a parse error if parsing cannot complete for undefined package path', () => {
      // improperly formatted JSON - note the lack of ':'
      const diagnostic = util.parsePackageJson('{ "someJson" "value"}', undefined);

      const expectedDiagnostic: d.Diagnostic = stubDiagnostic({
        absFilePath: undefined,
        header: 'Error Parsing JSON',
        messageText: 'Unexpected string in JSON at position 13', // due to missing colon in input
        type: 'build',
      });

      expect(diagnostic).toEqual<util.ParsePackageJsonResult>({
        diagnostic: expectedDiagnostic,
        data: null,
        filePath: undefined,
      });
    });

    it('returns the parsed data from the provided json', () => {
      const diagnostic = util.parsePackageJson('{ "someJson": "value"}', mockPackageJsonPath);

      expect(diagnostic).toEqual<util.ParsePackageJsonResult>({
        diagnostic: null,
        data: {
          someJson: 'value',
        },
        filePath: mockPackageJsonPath,
      });
    });
  });
});
