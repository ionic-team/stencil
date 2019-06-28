import * as d from '@stencil/core/declarations';
import { validateOutputTargetDist } from '../validate-outputs-dist';
import path from 'path';


describe('validateDistOutputTarget', () => {

  let config: d.Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: '/'
    };
  });

  it('should set dist values', () => {
    const outputTarget: d.OutputTargetDist = {
      type: 'dist',
      dir: 'my-dist',
      buildDir: 'my-build',
      empty: false
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetDist(config);
    expect(config.outputTargets).toEqual([
      {
        'buildDir': '/my-dist/my-build',
        'collectionDir': '/my-dist/collection',
        'copy': [],
        'dir': '/my-dist',
        'empty': false,
        'esmLoaderPath': '/my-dist/loader',
        'resourcesUrl': undefined,
        'type': 'dist',
        'typesDir': '/my-dist/types'
      },
      {
        'collectionDir': '/my-dist/collection',
        'dir': '/my-dist',
        'type': 'dist-collection'
      },
      {
        'copy': [
          {'src': '**/*.svg'},
          {'src': '**/*.js'}
        ],
        'copyAssets': 'collection',
        'dir': '/my-dist/collection',
        'type': 'copy'
      },
      {
        'dir': '/my-dist',
        'type': 'dist-types',
        'typesDir': '/my-dist/types'
      },
      {
        'esmDir': '/my-dist/my-build/app',
        'isBrowserBuild': true,
        'legacyLoaderFile': '/my-dist/my-build/app.js',
        'polyfills': true,
        'systemDir': undefined,
        'systemLoaderFile': undefined,
        'type': 'dist-lazy'},
        {
          'copyAssets': 'dist',
          'dir': '/my-dist/my-build/app',
          'type': 'copy'
        },
        {
          'file': '/my-dist/my-build/app/undefined.css',
          'type': 'dist-global-styles'
        }
      ]);
  });

  it('should set defaults when outputTargets dist is empty', () => {
    config.outputTargets = [
      { type: 'dist' }
    ];
    validateOutputTargetDist(config);
    const outputTarget = config.outputTargets.find(o => o.type === 'dist') as d.OutputTargetDist;
    expect(outputTarget).toBeDefined();
    expect(outputTarget.dir).toBe('/dist');
    expect(outputTarget.buildDir).toBe('/dist');
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add dist when outputTargets exists, but without dist', () => {
    config.outputTargets = [];
    validateOutputTargetDist(config);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
  });

});
