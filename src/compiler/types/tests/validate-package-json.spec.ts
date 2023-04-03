import type * as d from '@stencil/core/declarations';
import { mockBuildCtx, mockCompilerCtx, mockValidatedConfig } from '@stencil/core/testing';
import { DIST_COLLECTION, DIST_CUSTOM_ELEMENTS, safeJSONStringify } from '@utils';
import path from 'path';

import { normalizePath } from '../../../utils/normalize-path';
import * as v from '../validate-build-package-json';

describe('validate-package-json', () => {
  let config: d.ValidatedConfig;
  let compilerCtx: d.CompilerCtx;
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

    const namespace = 'SomeNamespace';
    config = mockValidatedConfig({
      devMode: false,
      fsNamespace: namespace.toLowerCase(),
      namespace,
      packageJsonFilePath: path.join(root, 'package.json'),
    });
    compilerCtx = mockCompilerCtx(config);
    buildCtx = mockBuildCtx(config, compilerCtx);
    buildCtx.packageJson = {};
    await compilerCtx.fs.writeFile(config.packageJsonFilePath, safeJSONStringify(buildCtx.packageJson));
  });

  describe('files', () => {
    it('should validate files "dist/"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDirs([distPath]);
      await compilerCtx.fs.commit();
      buildCtx.packageJson.files = ['dist/'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist/"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDirs([distPath]);
      await compilerCtx.fs.commit();
      buildCtx.packageJson.files = ['./dist/'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "./dist"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDirs([distPath]);
      await compilerCtx.fs.commit();
      buildCtx.packageJson.files = ['./dist'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should validate files "dist"', async () => {
      const distPath = path.join(root, 'dist');
      await compilerCtx.fs.emptyDirs([distPath]);
      await compilerCtx.fs.commit();
      buildCtx.packageJson.files = ['dist'];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('should error when files array misses dist/', async () => {
      buildCtx.packageJson.files = [];
      await v.validatePackageFiles(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/array must contain the distribution directory/);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/"dist\/"/);
    });
  });

  describe('module', () => {
    it('validate dist module', async () => {
      config.outputTargets = [];
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.js'), '');
      buildCtx.packageJson.module = 'dist/index.js';
      await v.validateModule(config, compilerCtx, buildCtx);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('validates a valid custom elements module', async () => {
      config.outputTargets = [
        {
          type: DIST_CUSTOM_ELEMENTS,
          dir: path.join(root, 'dist', 'components'),
        },
      ];
      buildCtx.packageJson.module = 'dist/components/index.js';
      await v.validateModule(config, compilerCtx, buildCtx);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('errors on an invalid custom elements module', async () => {
      config.outputTargets = [
        {
          type: DIST_CUSTOM_ELEMENTS,
          dir: path.join(root, 'dist', 'components'),
        },
      ];
      buildCtx.packageJson.module = 'dist/index.js';
      await v.validateModule(config, compilerCtx, buildCtx);
      expect(buildCtx.diagnostics).toHaveLength(1);
      const [diagnostic] = buildCtx.diagnostics;
      expect(diagnostic.level).toBe('warn');
      expect(diagnostic.messageText).toBe(
        `package.json "module" property is set to "dist/index.js". It's recommended to set the "module" property to: ./dist/components/index.js`
      );
    });

    it('missing dist module', async () => {
      config.outputTargets = [];
      await v.validateModule(config, compilerCtx, buildCtx);
      expect(buildCtx.diagnostics).toHaveLength(1);
      const [diagnostic] = buildCtx.diagnostics;
      expect(diagnostic.level).toBe('warn');
      expect(diagnostic.messageText).toBe('package.json "module" property is required when generating a distribution.');
    });

    it.each<{
      ot: d.OutputTarget;
      path: string;
    }>([
      {
        ot: {
          type: DIST_CUSTOM_ELEMENTS,
          dir: path.join(root, 'dist', 'components'),
        },
        path: 'dist/components/index.js',
      },
      {
        ot: {
          type: DIST_COLLECTION,
          dir: path.join(root, 'dist'),
          collectionDir: 'dist/collection',
        },
        path: 'dist/index.js',
      },
    ])('errors on missing module w/ $ot.type, suggests $path', async ({ ot, path }) => {
      config.outputTargets = [ot];
      buildCtx.packageJson.module = undefined;
      await v.validateModule(config, compilerCtx, buildCtx);
      expect(buildCtx.diagnostics).toHaveLength(1);
      const [diagnostic] = buildCtx.diagnostics;
      expect(diagnostic.level).toBe('warn');
      expect(diagnostic.messageText).toBe(
        `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${normalizePath(
          path
        )}`
      );
    });
  });

  describe('main', () => {
    it('main cannot be the old loader', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'somenamespace.js'), '');
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.cjs.js'), '');
      buildCtx.packageJson.main = 'dist/somenamespace.js';
      v.validateMain(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('validate main', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'index.cjs.js'), '');
      buildCtx.packageJson.main = 'dist/index.cjs.js';
      v.validateMain(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('missing main', async () => {
      v.validateMain(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });
  });

  describe('types', () => {
    it('validate types', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      buildCtx.packageJson.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, compilerCtx, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(0);
    });

    it('not d.ts file', async () => {
      compilerCtx.fs.writeFile(path.join(root, 'dist', 'types', 'components.d.ts'), '');
      buildCtx.packageJson.types = 'dist/types/components.ts';
      v.validateTypes(config, compilerCtx, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing types file', async () => {
      buildCtx.packageJson.types = 'dist/types/components.d.ts';
      await v.validateTypes(config, compilerCtx, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });

    it('missing types', async () => {
      v.validateTypes(config, compilerCtx, buildCtx, typesOutputTarget);
      expect(buildCtx.diagnostics).toHaveLength(1);
    });
  });

  describe('collection', () => {
    it('should error when missing collection property', async () => {
      v.validateCollection(config, compilerCtx, buildCtx, collectionOutputTarget);
      expect(buildCtx.diagnostics[0].messageText).toMatch(/package.json "collection" property is required/);
    });
  });
});
