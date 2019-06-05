import * as d from '@stencil/core/declarations';
import { mockBuildCtx, mockCompilerCtx, mockConfig } from '@stencil/core/testing';
import * as v from '../validate-package-json';
import path from 'path';


describe('validate-package-json', () => {
  let config: d.Config;
  let compilerCtx: d.CompilerCtx;
  let buildCtx: d.BuildCtx;
  let outputTarget: d.OutputTargetDistCollection;
  const root = path.resolve('/');

  beforeEach(async () => {
    outputTarget = {
      type: 'dist-collection',
      dir: '/dist',
      collectionDir: '/dist/collection',
      typesDir: '/dist/types',
      copy: []
    };
    config = mockConfig();
    config.devMode = false;
    config.namespace = 'SomeNamespace';
    config.fsNamespace = config.namespace.toLowerCase();
    compilerCtx = mockCompilerCtx();
    buildCtx = mockBuildCtx(config, compilerCtx);
    buildCtx.packageJson = {};
    buildCtx.packageJsonFilePath = path.join(root, 'package.json');
    await compilerCtx.fs.writeFile(buildCtx.packageJsonFilePath, JSON.stringify(buildCtx.packageJson));
  });

  describe('files', () => {

    it('should validate files "dist/"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDir(distPath);
      buildCtx.packageJson.files = ['dist/'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist/"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDir(distPath);
      buildCtx.packageJson.files = ['./dist/'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDir(distPath);
      buildCtx.packageJson.files = ['./dist'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "dist"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDir(distPath);
      buildCtx.packageJson.files = ['dist'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should error when files array misses dist/', async () => {
      buildCtx.packageJson.files = [];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/array must contain the distribution directory/);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/"dist\/"/);
    });

  });

  describe('module', () => {

    it('validate module', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.mjs'), '');
      buildCtx.packageJson.module = 'dist/index.mjs';
      v.validateModule(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('missing module', async () => {
      v.validateModule(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

  });

  describe('main', () => {

    it('main cannot be the old loader', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'somenamespace.js'), '');
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      buildCtx.packageJson.main = 'dist/somenamespace.js';
      v.validateMain(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('validate main', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      buildCtx.packageJson.main = 'dist/index.js';
      v.validateMain(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('missing main', async () => {
      v.validateMain(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

  });

  describe('types', () => {

    it('validate types', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      buildCtx.packageJson.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('not d.ts file', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      buildCtx.packageJson.types = 'dist/types/components.ts';
      v.validateTypes(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing types file', async () => {
      buildCtx.packageJson.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing types', async () => {
      v.validateTypes(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

  });

  describe('collection', () => {

    it('should error when missing collection property', async () => {
      v.validateCollection(config, compilerCtx, buildCtx, outputTarget);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/dist\/collection\/collection-manifest.json/);
    });

  });

});
