import * as d from '@stencil/core/declarations';
import { validateOutputTargetDist } from '../validate-outputs-dist';
import path from 'path';

describe('validateDistOutputTarget', () => {
  const rootDir = path.resolve('/');

  let config: d.Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path,
      },
      rootDir,
    };
  });

  it('should set dist values', () => {
    const outputTarget: d.OutputTargetDist = {
      type: 'dist',
      dir: 'my-dist',
      buildDir: 'my-build',
      empty: false,
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetDist(config);
    expect(config.outputTargets).toEqual([
      {
        buildDir: path.join(rootDir, 'my-dist', 'my-build'),
        collectionDir: path.join(rootDir, 'my-dist', 'collection'),
        copy: [],
        dir: path.join(rootDir, 'my-dist'),
        empty: false,
        esmLoaderPath: path.join(rootDir, 'my-dist', 'loader'),
        resourcesUrl: undefined,
        type: 'dist',
        typesDir: path.join(rootDir, 'my-dist', 'types'),
      },
      {
        collectionDir: path.join(rootDir, 'my-dist', 'collection'),
        dir: path.join(rootDir, '/my-dist'),
        type: 'dist-collection',
      },
      {
        copy: [{ src: '**/*.svg' }, { src: '**/*.js' }],
        copyAssets: 'collection',
        dir: path.join(rootDir, 'my-dist', 'collection'),
        type: 'copy',
      },
      {
        dir: path.join(rootDir, 'my-dist'),
        type: 'dist-types',
        typesDir: path.join(rootDir, 'my-dist', 'types'),
      },
      {
        esmDir: path.join(rootDir, 'my-dist', 'my-build', 'app'),
        isBrowserBuild: true,
        legacyLoaderFile: path.join(rootDir, 'my-dist', 'my-build', 'app.js'),
        polyfills: true,
        systemDir: undefined,
        systemLoaderFile: undefined,
        type: 'dist-lazy',
      },
      {
        copyAssets: 'dist',
        dir: path.join(rootDir, 'my-dist', 'my-build', 'app'),
        type: 'copy',
      },
      {
        file: path.join(rootDir, 'my-dist', 'my-build', 'app', 'undefined.css'),
        type: 'dist-global-styles',
      },
    ]);
  });

  it('should set defaults when outputTargets dist is empty', () => {
    config.outputTargets = [{ type: 'dist' }];
    validateOutputTargetDist(config);
    const outputTarget = config.outputTargets.find(o => o.type === 'dist') as d.OutputTargetDist;
    expect(outputTarget).toBeDefined();
    expect(outputTarget.dir).toBe(path.join(rootDir, 'dist'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, '/dist'));
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add dist when outputTargets exists, but without dist', () => {
    config.outputTargets = [];
    validateOutputTargetDist(config);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
  });
});
