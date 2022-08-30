import type * as d from '@stencil/core/declarations';
import { validateConfig } from '../validate-config';
import { mockConfig, mockLoadConfigInit } from '@stencil/core/testing';
import path from 'path';

describe('validateDistOutputTarget', () => {
  const rootDir = path.resolve('/');

  let userConfig: d.Config;
  beforeEach(() => {
    userConfig = mockConfig();
  });

  it('should set dist values', () => {
    const outputTarget: d.OutputTargetDist = {
      type: 'dist',
      dir: 'my-dist',
      buildDir: 'my-build',
      empty: false,
    };
    userConfig.outputTargets = [outputTarget];
    userConfig.buildDist = true;
    const { config } = validateConfig(userConfig, mockLoadConfigInit());
    expect(config.outputTargets).toEqual([
      {
        buildDir: path.join(rootDir, 'my-dist', 'my-build'),
        collectionDir: path.join(rootDir, 'my-dist', 'collection'),
        copy: [],
        dir: path.join(rootDir, 'my-dist'),
        empty: false,
        esmLoaderPath: path.join(rootDir, 'my-dist', 'loader'),
        type: 'dist',
        polyfills: undefined,
        typesDir: path.join(rootDir, 'my-dist', 'types'),
      },
      {
        esmDir: path.join(rootDir, 'my-dist', 'my-build', 'testing'),
        empty: false,
        isBrowserBuild: true,
        legacyLoaderFile: path.join(rootDir, 'my-dist', 'my-build', 'testing.js'),
        polyfills: true,
        systemDir: undefined,
        systemLoaderFile: undefined,
        type: 'dist-lazy',
      },
      {
        copyAssets: 'dist',
        copy: [],
        dir: path.join(rootDir, 'my-dist', 'my-build', 'testing'),
        type: 'copy',
      },
      {
        file: path.join(rootDir, 'my-dist', 'my-build', 'testing', 'testing.css'),
        type: 'dist-global-styles',
      },
      {
        dir: path.join(rootDir, 'my-dist'),
        type: 'dist-types',
        typesDir: path.join(rootDir, 'my-dist', 'types'),
      },
      {
        collectionDir: path.join(rootDir, 'my-dist', 'collection'),
        dir: path.join(rootDir, '/my-dist'),
        empty: false,
        type: 'dist-collection',
      },
      {
        copy: [{ src: '**/*.svg' }, { src: '**/*.js' }],
        copyAssets: 'collection',
        dir: path.join(rootDir, 'my-dist', 'collection'),
        type: 'copy',
      },
      {
        type: 'dist-lazy',
        cjsDir: path.join(rootDir, 'my-dist', 'cjs'),
        cjsIndexFile: path.join(rootDir, 'my-dist', 'index.cjs.js'),
        empty: false,
        esmDir: path.join(rootDir, 'my-dist', 'esm'),
        esmEs5Dir: undefined,
        esmIndexFile: path.join(rootDir, 'my-dist', 'index.js'),
        polyfills: true,
      },
      {
        cjsDir: path.join(rootDir, 'my-dist', 'cjs'),
        componentDts: path.join(rootDir, 'my-dist', 'types', 'components.d.ts'),
        dir: path.join(rootDir, 'my-dist', 'loader'),
        empty: false,
        esmDir: path.join(rootDir, 'my-dist', 'esm'),
        esmEs5Dir: undefined,
        type: 'dist-lazy-loader',
      },
    ]);
  });

  it('should set defaults when outputTargets dist is empty', () => {
    userConfig.outputTargets = [{ type: 'dist' }];
    const { config } = validateConfig(userConfig, mockLoadConfigInit());
    const outputTarget = config.outputTargets.find((o) => o.type === 'dist') as d.OutputTargetDist;
    expect(outputTarget).toBeDefined();
    expect(outputTarget.dir).toBe(path.join(rootDir, 'dist'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, '/dist'));
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add dist when outputTargets exists, but without dist', () => {
    userConfig.outputTargets = [];
    const { config } = validateConfig(userConfig, mockLoadConfigInit());
    expect(config.outputTargets.some((o) => o.type === 'dist')).toBe(false);
  });
});
