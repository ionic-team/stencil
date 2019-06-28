import * as d from '@stencil/core/declarations';
import {
  validateOutputTargetWww
} from '../validate-outputs-www';
import {
  isOutputTargetCopy,
  isOutputTargetWww
} from '../../output-targets/output-utils';
import path, { join } from 'path';


describe('validateOutputTargetWww', () => {

  const rootDir = path.resolve('/');
  let config: d.Config;
  beforeEach(() => {
    config = {
      sys: {
        path: path
      },
      rootDir: rootDir,
      flags: {}
    } as any;
  });

  it('should have default value', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs')
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config, []);

    expect(config.outputTargets).toEqual([{
      'appDir': path.join(rootDir, 'www', 'docs/'),
      'baseUrl': '/',
      'buildDir': path.join(rootDir, 'www', 'docs', 'build'),
      'dir': path.join(rootDir, 'www', 'docs'),
      'empty': true,
      'indexHtml': path.join(rootDir, 'www', 'docs', 'index.html'),
      'polyfills': true,
      'serviceWorker': {
        'dontCacheBustURLsMatching': /p-\w{8}/,
        'globDirectory': path.join(rootDir, 'www', 'docs/'),
        'globIgnores': ['**/host.config.json', '**/*.system.entry.js', '**/*.system.js', '**/undefined.js', '**/undefined.esm.js', '**/undefined.css'],
        'globPatterns': ['*.html', '**/*.{js,css,json}'],
        'swDest': path.join(rootDir, 'www', 'docs', 'sw.js')
      },
      'type': 'www'
    }, {
      'esmDir': path.join(rootDir, 'www', 'docs', 'build'),
      'isBrowserBuild': true,
      'polyfills': true,
      'systemDir': path.join(rootDir, 'www', 'docs', 'build'),
      'systemLoaderFile': path.join(rootDir, '/www/docs/build/undefined.js'),
      'type': 'dist-lazy'
    }, {
      'copyAssets': 'dist',
      'dir': path.join(rootDir, 'www', 'docs', 'build'),
      'type': 'copy'
    }, {
      'copy': [{
        'src': 'assets',
        'warn': false
      }, {
        'src': 'manifest.json',
        'warn': false
      }],
      'dir': path.join(rootDir, 'www', 'docs'),
      'type': 'copy'
    }, {
      'file': path.join(rootDir, 'www', 'docs', 'build', 'undefined.css'),
      'type': 'dist-global-styles'
    }]);
  });


  it('should www with sub directory', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs')
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config, []);

    expect(outputTarget.dir).toBe(path.join(rootDir, 'www', 'docs'));
    expect(outputTarget.appDir).toBe(path.join(rootDir, 'www', 'docs/'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
  });

  it('should set www values', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: 'my-www',
      buildDir: 'my-build',
      indexHtml: 'my-index.htm',
      empty: false
    };
    config.outputTargets = [outputTarget];
    validateOutputTargetWww(config, []);

    expect(outputTarget.type).toBe('www');
    expect(outputTarget.dir).toBe(path.join(rootDir, 'my-www'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'my-www', 'my-build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'my-www', 'my-index.htm'));
    expect(outputTarget.empty).toBe(false);
  });

  it('should default to add www when outputTargets is undefined', () => {
    validateOutputTargetWww(config, []);
    expect(config.outputTargets).toHaveLength(5);

    const outputTarget = config.outputTargets.find(isOutputTargetWww);
    expect(outputTarget.dir).toBe(path.join(rootDir, 'www'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'index.html'));
    expect(outputTarget.empty).toBe(true);
  });

  it('should default to not add www when outputTargets exists, but without www', () => {
    config.outputTargets = [];
    validateOutputTargetWww(config, []);
    expect(config.outputTargets.some(isOutputTargetWww)).toBe(false);
  });

  describe('baseUrl', () => {
    it('baseUrl does not end with /', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: 'my-www',
        baseUrl: '/docs',
      };
      config.outputTargets = [outputTarget];
      validateOutputTargetWww(config, []);

      expect(outputTarget.type).toBe('www');
      expect(outputTarget.dir).toBe(path.join(rootDir, 'my-www'));
      expect(outputTarget.baseUrl).toBe('/docs/');
      expect(outputTarget.appDir).toBe(path.join(rootDir, 'my-www/docs/'));

      expect(outputTarget.buildDir).toBe(path.join(rootDir, 'my-www', 'docs', 'build'));
      expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'my-www', 'docs', 'index.html'));
    });

    it('baseUrl does not end with /', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        baseUrl: '/docs/',
      };
      config.outputTargets = [outputTarget];
      validateOutputTargetWww(config, []);

      expect(outputTarget.type).toBe('www');
      expect(outputTarget.dir).toBe(path.join(rootDir, 'www'));
      expect(outputTarget.baseUrl).toBe('/docs/');
      expect(outputTarget.appDir).toBe(path.join(rootDir, 'www/docs/'));

      expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
      expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
    });


    it('baseUrl is a full url', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        baseUrl: 'https://example.com/docs',
      };
      config.outputTargets = [outputTarget];
      validateOutputTargetWww(config, []);

      expect(outputTarget.type).toBe('www');
      expect(outputTarget.dir).toBe(path.join(rootDir, 'www'));
      expect(outputTarget.baseUrl).toBe('https://example.com/docs/');
      expect(outputTarget.appDir).toBe(path.join(rootDir, 'www/docs/'));

      expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
      expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
    });
  });

  describe('copy', () => {

    it('should add copy tasks', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: path.join('www', 'docs'),
        copy: [{
          src: 'index-modules.html',
          dest: 'index-2.html'
        }]
      };
      config.outputTargets = [outputTarget];
      validateOutputTargetWww(config, []);

      const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
      expect(copyTargets).toEqual([{
        'copyAssets': 'dist',
        'dir': join(rootDir, 'www', 'docs', 'build'),
        'type': 'copy'
      }, {
        'copy': [{
          'dest': 'index-2.html',
          'src': 'index-modules.html'
        }, {
          'src': 'assets',
          'warn': false
        }, {
          'src': 'manifest.json',
          'warn': false
        }],
        'dir': join(rootDir, 'www', 'docs'),
        'type': 'copy'
      }]);
    });

    it('should replace copy tasks', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: path.join('www', 'docs'),
        copy: [{
          src: 'assets',
          dest: 'assets2'
        }]
      };
      config.outputTargets = [outputTarget];
      validateOutputTargetWww(config, []);

      const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
      expect(copyTargets).toEqual([{
          'copyAssets': 'dist',
          'dir': join(rootDir, 'www', 'docs', 'build'),
          'type': 'copy'
        },
        {
          'copy': [{
              'dest': 'assets2',
              'src': 'assets'
            },
            {
              'src': 'manifest.json',
              'warn': false
            }
          ],
          'dir': join(rootDir, 'www', 'docs'),
          'type': 'copy'
        }
      ]);
    });

    it('should disable copy tasks', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: path.join('www', 'docs'),
        copy: null
      };
      config.outputTargets = [outputTarget];
      validateOutputTargetWww(config, []);

      const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
      expect(copyTargets).toEqual([{
        'copyAssets': 'dist',
        'dir': join(rootDir, 'www', 'docs', 'build'),
        'type': 'copy'
      }, {
        'copy': [],
        'dir': join(rootDir, 'www', 'docs'),
        'type': 'copy'
      }]);
    });
  });
});
