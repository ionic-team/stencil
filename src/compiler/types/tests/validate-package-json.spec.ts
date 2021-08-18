import type * as d from '@stencil/core/declarations';
import { mockBuildCtx, mockCompilerCtx, mockConfig } from '@stencil/core/testing';
import * as v from '../validate-build-package-json';
import path from 'path';
import { getStencilCompilerContext, initializeStencilCompilerContext } from '@utils';

describe('validate-package-json', () => {
  let config: d.Config;
  let buildCtx: d.BuildCtx;
  let collectionOutputTarget: d.OutputTargetDistCollection;
  let typesOutputTarget: d.OutputTargetDistTypes;
  const root = path.resolve('/');

  beforeEach(async () => {
    collectionOutputTarget = {
      type: 'dist-collection',
      dir: '/dist',
      collectionDir: '/dist/collection',
    };
    typesOutputTarget = {
      type: 'dist-types',
      dir: '/dist',
      typesDir: '/dist/types',
    };
    config = mockConfig();
    config.devMode = false;
    config.namespace = 'SomeNamespace';
    config.fsNamespace = config.namespace.toLowerCase();
    initializeStencilCompilerContext({ compilerCtx: mockCompilerCtx(config) });
    buildCtx = mockBuildCtx(config);
    buildCtx.packageJson = {};
    config.packageJsonFilePath = path.join(root, 'package.json');
    await getStencilCompilerContext().fs.writeFile(config.packageJsonFilePath, JSON.stringify(buildCtx.packageJson));
  });

  describe('files', () => {
    it('should validate files "dist/"', async () => {
      const distPath = path.join(root, 'dist');
      await getStencilCompilerContext().fs.emptyDirs([distPath]);
      await getStencilCompilerContext().fs.commit();
      buildCtx.packageJson.files = ['dist/'];
      await v.validatePackageFiles(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist/"', async () => {
      const distPath = path.join(root, 'dist');
      await getStencilCompilerContext().fs.emptyDirs([distPath]);
      await getStencilCompilerContext().fs.commit();
      buildCtx.packageJson.files = ['./dist/'];
      await v.validatePackageFiles(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist"', async () => {
      const distPath = path.join(root, 'dist');
      await getStencilCompilerContext().fs.emptyDirs([distPath]);
      await getStencilCompilerContext().fs.commit();
      buildCtx.packageJson.files = ['./dist'];
      await v.validatePackageFiles(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "dist"', async () => {
      const distPath = path.join(root, 'dist');
      await getStencilCompilerContext().fs.emptyDirs([distPath]);
      await getStencilCompilerContext().fs.commit();
      buildCtx.packageJson.files = ['dist'];
      await v.validatePackageFiles(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should error when files array misses dist/', async () => {
      buildCtx.packageJson.files = [];
      await v.validatePackageFiles(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/array must contain the distribution directory/);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/"dist\/"/);
    });
  });

  describe('module', () => {
    it('validate dist module', async () => {
      config.outputTargets = [];
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      buildCtx.packageJson.module = 'dist/index.js';
      v.validateModule(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('validate custom elements module', async () => {
      config.outputTargets = [
        {
          type: 'dist-custom-elements-bundle',
          dir: path.join(root, 'custom-elements'),
        },
      ];
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      buildCtx.packageJson.module = 'custom-elements/index.js';
      v.validateModule(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('missing dist module', async () => {
      config.outputTargets = [];
      v.validateModule(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing dist module, but has custom elements output', async () => {
      config.outputTargets = [
        {
          type: 'dist-custom-elements-bundle',
          dir: path.join(root, 'custom-elements'),
        },
      ];
      v.validateModule(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });
  });

  describe('main', () => {
    it('main cannot be the old loader', async () => {
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'somenamespace.js'), '');
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'index.cjs.js'), '');
      buildCtx.packageJson.main = 'dist/somenamespace.js';
      v.validateMain(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('validate main', async () => {
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'index.cjs.js'), '');
      buildCtx.packageJson.main = 'dist/index.cjs.js';
      v.validateMain(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('missing main', async () => {
      v.validateMain(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });
  });

  describe('types', () => {
    it('validate types', async () => {
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      buildCtx.packageJson.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('not d.ts file', async () => {
      await getStencilCompilerContext().fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      buildCtx.packageJson.types = 'dist/types/components.ts';
      v.validateTypes(config, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing types file', async () => {
      buildCtx.packageJson.types = 'dist/types/something-else.d.ts';
      await v.validateTypes(config, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing types', async () => {
      v.validateTypes(config, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });
  });

  describe('collection', () => {
    it('should error when missing collection property', async () => {
      v.validateCollection(config, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
    });
  });
});
