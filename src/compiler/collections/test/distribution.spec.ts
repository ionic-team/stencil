import { BuildResults, CompilerCtx, ComponentRegistry, Config, Diagnostic, OutputTarget, PackageJsonData } from '../../../declarations';
import { mockConfig } from '../../../testing/mocks';
import { validatePackageFiles, validatePackageJson } from '../distribution';
import * as path from 'path';


describe('distribution', () => {

  describe('updatePackageJson', () => {

    let config: Config;
    let diagnostics: Diagnostic[];
    let packageJsonData: PackageJsonData;
    let outputTarget: OutputTarget;

    beforeEach(() => {
      outputTarget = {
        type: 'dist',
        dir: '/dist',
        collectionDir: '/dist/collection',
        typesDir: '/dist/types'
      };
      config = mockConfig();
      config.namespace = 'SomeNamespace';
      config.fsNamespace = config.namespace.toLowerCase();
      diagnostics = [];
      packageJsonData = {};
    });


    it('should validate windows paths', () => {
      packageJsonData.files = [
        '.\\dist'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      packageJsonData.types = 'dist\\types\\index.d.ts';
      packageJsonData.collection = 'dist\\collection\\collection-manifest.json';
      validatePackageJson(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should error when missing collection property', () => {
      packageJsonData.files = [
        'dist/'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      packageJsonData.types = 'dist/types/index.d.ts';
      validatePackageJson(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/collection\/collection-manifest.json/);
    });

    it('should error when missing types property', () => {
      packageJsonData.files = [
        'dist/'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      validatePackageJson(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "types" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/types\/components.d.ts/);
    });

    it('should error when missing types property isnt a d.ts file', () => {
      packageJsonData.files = [
        'dist/'
      ];
      packageJsonData.main = 'dist/somenamespace.js';
      packageJsonData.types = 'dist/types/components.ts';
      validatePackageJson(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "types" file must have a ".d.ts" e/);
      expect(diagnostics[0].messageText).toMatch(/dist\/types\/components.ts/);
    });

    it('should error when missing main property', () => {
      packageJsonData.files = [
        'dist/'
      ];
      validatePackageJson(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "main" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/somenamespace.js/);
    });

    it('should validate files "dist/"', () => {
      packageJsonData.files = ['dist/'];
      validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should validate files "./dist/"', () => {
      packageJsonData.files = ['./dist/'];
      validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should validate files "./dist"', () => {
      packageJsonData.files = ['./dist'];
      validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should validate files "dist"', () => {
      packageJsonData.files = ['dist'];
      validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics.length).toBe(0);
    });

    it('should error when files array misses dist/', () => {
      packageJsonData.files = [];
      validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/array must contain the distribution directory/);
      expect(diagnostics[0].messageText).toMatch(/"dist\/"/);
    });

  });

});
