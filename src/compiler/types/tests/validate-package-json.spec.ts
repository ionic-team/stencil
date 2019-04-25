import * as d from '@stencil/core/declarations';
import { mockCompilerCtx, mockConfig } from '@stencil/core/testing';
import * as v from '../validate-package-json';
import path from 'path';


describe('validate-package-json', () => {
  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let diagnostics: d.Diagnostic[];
  let packageJsonData: d.PackageJsonData;
  let outputTarget: d.OutputTargetDist;
  const root = path.resolve('/');

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
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.mjs'), '');
      packageJsonData.module = 'dist/index.mjs';
      v.validateModule(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('missing module', async () => {
      v.validateModule(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

  });

  describe('main', () => {

    it('main cannot be the old loader', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'somenamespace.js'), '');
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      packageJsonData.main = 'dist/somenamespace.js';
      v.validateMain(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('validate main', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      packageJsonData.main = 'dist/index.js';
      v.validateMain(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('missing main', async () => {
      v.validateMain(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

  });

  describe('types', () => {

    it('validate types', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      packageJsonData.types = 'dist/types/components.d.ts';
      v.validateTypes(config, outputTarget, diagnostics, packageJsonData);
      await v.validateTypesExist(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(0);
    });

    it('not d.ts file', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      packageJsonData.types = 'dist/types/components.ts';
      v.validateTypes(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('missing types file', async () => {
      packageJsonData.types = 'dist/types/components.d.ts';
      v.validateTypes(config, outputTarget, diagnostics, packageJsonData);
      await v.validateTypesExist(config, compilerCtx, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

    it('missing types', async () => {
      v.validateTypes(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics).toHaveLength(1);
    });

  });

  describe('collection', () => {

    it('should error when missing collection property', async () => {
      v.validateCollection(config, outputTarget, diagnostics, packageJsonData);
      expect(diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
      expect(diagnostics[0].messageText).toMatch(/dist\/collection\/collection-manifest.json/);
    });

  });

});
