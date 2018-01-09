import { validatePackageJson, validatePackageFiles } from '../distribution';
import { BuildConfig, BuildContext, BuildResults, ComponentRegistry, Diagnostic } from '../../../util/interfaces';
import { mockBuildConfig } from '../../../testing/mocks';
import * as path from 'path';


describe('distribution', () => {

  describe('updatePackageJson', () => {

    it('should validate windows paths', () => {
      packageJsonData.files = [
        '.\\dist'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      packageJsonData.types = 'dist\\types\\index.d.ts';
      packageJsonData.collection = 'dist\\collection\\collection-manifest.json';
      validatePackageJson(config, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should error when missing collection property', () => {
      packageJsonData.files = [
        'dist/'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      packageJsonData.types = 'dist/types/index.d.ts';
      validatePackageJson(config, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/collection\/collection-manifest.json/);
    });

    it('should error when missing types property', () => {
      packageJsonData.files = [
        'dist/'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      validatePackageJson(config, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "types" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/types\/components.d.ts/);
    });

    it('should error when missing main property', () => {
      packageJsonData.files = [
        'dist/'
      ];
      validatePackageJson(config, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "main" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/somenamespace.js/);
    });

    it('should validate files "dist/"', () => {
      packageJsonData.files = ['dist/'];
      validatePackageFiles(config, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should validate files "./dist/"', () => {
      packageJsonData.files = ['./dist/'];
      validatePackageFiles(config, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should validate files "./dist"', () => {
      packageJsonData.files = ['./dist'];
      validatePackageFiles(config, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should validate files "dist"', () => {
      packageJsonData.files = ['dist'];
      validatePackageFiles(config, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should error when files array misses dist/', () => {
      packageJsonData.files = [];
      validatePackageFiles(config, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/array must contain the distribution directory/);
      expect(diagnostics[0].messageText).toMatch(/"dist\/"/);
    });

    var config: BuildConfig;
    var diagnostics: Diagnostic[];
    var packageJsonData: any;

    beforeEach(() => {
      config = mockBuildConfig();
      config.namespace = 'SomeNamespace';
      config.fsNamespace = config.namespace.toLowerCase();
      diagnostics = [];
      packageJsonData = {};
    });
  });

});
