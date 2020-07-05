import * as d from '@stencil/core/declarations';
import { isOutputTargetCopy, isOutputTargetWww } from '../../output-targets/output-utils';
import { validateConfig } from '../validate-config';
import path from 'path';

describe('validateOutputTargetWww', () => {
  const rootDir = path.resolve('/');
  let userConfig: d.Config;
  beforeEach(() => {
    userConfig = {
      rootDir: rootDir,
      flags: {},
    } as any;
  });

  it('should have default value', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs'),
    };
    userConfig.outputTargets = [outputTarget];
    userConfig.buildEs5 = false;
    const { config } = validateConfig(userConfig);

    expect(config.outputTargets).toEqual([
      {
        appDir: path.join(rootDir, 'www', 'docs'),
        baseUrl: '/',
        buildDir: path.join(rootDir, 'www', 'docs', 'build'),
        dir: path.join(rootDir, 'www', 'docs'),
        empty: true,
        indexHtml: path.join(rootDir, 'www', 'docs', 'index.html'),
        polyfills: true,
        serviceWorker: {
          dontCacheBustURLsMatching: /p-\w{8}/,
          globDirectory: path.join(rootDir, 'www', 'docs'),
          globIgnores: ['**/host.config.json', '**/*.system.entry.js', '**/*.system.js', '**/app.js', '**/app.esm.js', '**/app.css'],
          globPatterns: ['*.html', '**/*.{js,css,json}'],
          swDest: path.join(rootDir, 'www', 'docs', 'sw.js'),
        },
        type: 'www',
      },
      {
        dir: path.join(rootDir, 'www', 'docs', 'build'),
        esmDir: path.join(rootDir, 'www', 'docs', 'build'),
        isBrowserBuild: true,
        polyfills: true,
        systemDir: undefined,
        systemLoaderFile: undefined,
        type: 'dist-lazy',
      },
      {
        copyAssets: 'dist',
        dir: path.join(rootDir, 'www', 'docs', 'build'),
        type: 'copy',
      },
      {
        copy: [
          {
            src: 'assets',
            warn: false,
          },
          {
            src: 'manifest.json',
            warn: false,
          },
        ],
        dir: path.join(rootDir, 'www', 'docs'),
        type: 'copy',
      },
      {
        dir: path.join(rootDir, 'www', 'docs', 'build'),
        type: 'dist-global-styles',
      },
    ]);
  });

  it('should www with sub directory', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: path.join('www', 'docs'),
    };
    userConfig.outputTargets = [outputTarget];
    const { config } = validateConfig(userConfig);
    const www = config.outputTargets.find(isOutputTargetWww);

    expect(www.dir).toBe(path.join(rootDir, 'www', 'docs'));
    expect(www.appDir).toBe(path.join(rootDir, 'www', 'docs'));
    expect(www.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
    expect(www.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
  });

  it('should set www values', () => {
    const outputTarget: d.OutputTargetWww = {
      type: 'www',
      dir: 'my-www',
      buildDir: 'my-build',
      indexHtml: 'my-index.htm',
      empty: false,
    };
    userConfig.outputTargets = [outputTarget];
    const { config } = validateConfig(userConfig);
    const www = config.outputTargets.find(isOutputTargetWww);

    expect(www.type).toBe('www');
    expect(www.dir).toBe(path.join(rootDir, 'my-www'));
    expect(www.buildDir).toBe(path.join(rootDir, 'my-www', 'my-build'));
    expect(www.indexHtml).toBe(path.join(rootDir, 'my-www', 'my-index.htm'));
    expect(www.empty).toBe(false);
  });

  it('should default to add www when outputTargets is undefined', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets).toHaveLength(5);

    const outputTarget = config.outputTargets.find(isOutputTargetWww);
    expect(outputTarget.dir).toBe(path.join(rootDir, 'www'));
    expect(outputTarget.buildDir).toBe(path.join(rootDir, 'www', 'build'));
    expect(outputTarget.indexHtml).toBe(path.join(rootDir, 'www', 'index.html'));
    expect(outputTarget.empty).toBe(true);
  });

  describe('baseUrl', () => {
    it('baseUrl does not end with /', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: 'my-www',
        baseUrl: '/docs',
      };
      userConfig.outputTargets = [outputTarget];
      const { config } = validateConfig(userConfig);
      const www = config.outputTargets.find(isOutputTargetWww);

      expect(www.type).toBe('www');
      expect(www.dir).toBe(path.join(rootDir, 'my-www'));
      expect(www.baseUrl).toBe('/docs/');
      expect(www.appDir).toBe(path.join(rootDir, 'my-www/docs'));

      expect(www.buildDir).toBe(path.join(rootDir, 'my-www', 'docs', 'build'));
      expect(www.indexHtml).toBe(path.join(rootDir, 'my-www', 'docs', 'index.html'));
    });

    it('baseUrl does not end with /', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        baseUrl: '/docs',
      };
      userConfig.outputTargets = [outputTarget];
      const { config } = validateConfig(userConfig);
      const www = config.outputTargets.find(isOutputTargetWww);

      expect(www.type).toBe('www');
      expect(www.dir).toBe(path.join(rootDir, 'www'));
      expect(www.baseUrl).toBe('/docs/');
      expect(www.appDir).toBe(path.join(rootDir, 'www/docs'));

      expect(www.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
      expect(www.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
    });

    it('baseUrl is a full url', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        baseUrl: 'https://example.com/docs',
      };
      userConfig.outputTargets = [outputTarget];
      const { config } = validateConfig(userConfig);
      const www = config.outputTargets.find(isOutputTargetWww);

      expect(www.type).toBe('www');
      expect(www.dir).toBe(path.join(rootDir, 'www'));
      expect(www.baseUrl).toBe('https://example.com/docs/');
      expect(www.appDir).toBe(path.join(rootDir, 'www/docs'));

      expect(www.buildDir).toBe(path.join(rootDir, 'www', 'docs', 'build'));
      expect(www.indexHtml).toBe(path.join(rootDir, 'www', 'docs', 'index.html'));
    });
  });

  describe('copy', () => {
    it('should add copy tasks', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: path.join('www', 'docs'),
        copy: [
          {
            src: 'index-modules.html',
            dest: 'index-2.html',
          },
        ],
      };
      userConfig.outputTargets = [outputTarget];
      const { config } = validateConfig(userConfig);

      const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
      expect(copyTargets).toEqual([
        {
          copyAssets: 'dist',
          dir: path.join(rootDir, 'www', 'docs', 'build'),
          type: 'copy',
        },
        {
          copy: [
            {
              dest: 'index-2.html',
              src: 'index-modules.html',
            },
            {
              src: 'assets',
              warn: false,
            },
            {
              src: 'manifest.json',
              warn: false,
            },
          ],
          dir: path.join(rootDir, 'www', 'docs'),
          type: 'copy',
        },
      ]);
    });

    it('should replace copy tasks', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: path.join('www', 'docs'),
        copy: [
          {
            src: 'assets',
            dest: 'assets2',
          },
        ],
      };
      userConfig.outputTargets = [outputTarget];
      const { config } = validateConfig(userConfig);

      const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
      expect(copyTargets).toEqual([
        {
          copyAssets: 'dist',
          dir: path.join(rootDir, 'www', 'docs', 'build'),
          type: 'copy',
        },
        {
          copy: [
            {
              dest: 'assets2',
              src: 'assets',
            },
            {
              src: 'manifest.json',
              warn: false,
            },
          ],
          dir: path.join(rootDir, 'www', 'docs'),
          type: 'copy',
        },
      ]);
    });

    it('should disable copy tasks', () => {
      const outputTarget: d.OutputTargetWww = {
        type: 'www',
        dir: path.join('www', 'docs'),
        copy: null,
      };
      userConfig.outputTargets = [outputTarget];
      const { config } = validateConfig(userConfig);

      const copyTargets = config.outputTargets.filter(isOutputTargetCopy);
      expect(copyTargets).toEqual([
        {
          copyAssets: 'dist',
          dir: path.join(rootDir, 'www', 'docs', 'build'),
          type: 'copy',
        },
        {
          copy: [],
          dir: path.join(rootDir, 'www', 'docs'),
          type: 'copy',
        },
      ]);
    });
  });
});
