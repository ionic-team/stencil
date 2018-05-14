import * as d from '../../../declarations';
import { mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import * as v from '../validate-package-json';
import * as path from 'path';


describe('validate-package-json', () => {
  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let diagnostics: d.Diagnostic[];
  let packageJsonData: d.PackageJsonData;
  let outputTarget: d.OutputTargetDist;

  beforeEach(() => {
    outputTarget = {
      type: 'dist',
      dir: '/dist',
      buildDir: '/dist',
      collectionDir: '/dist/collection',
      typesDir: '/dist/types'
    };
    config = mockConfig();
    config.namespace = 'SomeNamespace';
    config.fsNamespace = config.namespace.toLowerCase();
    compilerCtx = mockCompilerCtx();
    diagnostics = [];
    packageJsonData = {};
  });

  describe('files', () => {

    it('should validate files "dist/"', async () => {
      packageJsonData.files = ['dist/'];
      v.validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist/"', async () => {
      packageJsonData.files = ['./dist/'];
      v.validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist"', async () => {
      packageJsonData.files = ['./dist'];
      v.validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('should validate files "dist"', async () => {
      packageJsonData.files = ['dist'];
      v.validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('should error when files array misses dist/', async () => {
      packageJsonData.files = [];
      v.validatePackageFiles(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/array must contain the distribution directory/);
      expect(diagnostics[0].messageText).toMatch(/"dist\/"/);
    });

  });

  describe('module', () => {

    it('validate module', async () => {
      compilerCtx.fs.writeFile('/dist/index.esm.js', '');
      packageJsonData.module = 'dist/index.esm.js';
      await v.validateModule(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('missing module file', async () => {
      packageJsonData.module = 'dist/index.esm.js';
      await v.validateModule(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('missing module', async () => {
      await v.validateModule(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

  });

  describe('main', () => {

    it('main cannot be the old loader', async () => {
      compilerCtx.fs.writeFile('/dist/somenamespace.js', '');
      compilerCtx.fs.writeFile('/dist/index.js', '');
      packageJsonData.main = 'dist/somenamespace.js';
      await v.validateMain(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('validate main', async () => {
      compilerCtx.fs.writeFile('/dist/index.js', '');
      packageJsonData.main = 'dist/index.js';
      await v.validateMain(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('missing main file', async () => {
      packageJsonData.main = 'dist/index.js';
      await v.validateMain(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('missing main', async () => {
      await v.validateMain(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

  });

  describe('types', () => {

    it('validate types', async () => {
      compilerCtx.fs.writeFile('/dist/types/components.d.ts', '');
      packageJsonData.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('not d.ts file', async () => {
      compilerCtx.fs.writeFile('/dist/types/components.ts', '');
      packageJsonData.types = 'dist/types/components.ts';
      await v.validateTypes(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('missing types file', async () => {
      packageJsonData.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('missing types', async () => {
      await v.validateTypes(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

  });

  describe('collection', () => {

    it('should error when missing collection property', async () => {
      await v.validateCollection(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/collection\/collection-manifest.json/);
    });

  });

  describe('namespace', () => {

    it('error App namespace', () => {
      config.namespace = 'App';
      config.fsNamespace = 'app';
      v.validateNamespace(config, diagnostics);
      expect(diagnostics).toHaveLength(1);
    });

    it('validate some namespace', () => {
      v.validateNamespace(config, diagnostics);
      expect(diagnostics).toHaveLength(0);
    });

  });

});
