import type * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { isWatchIgnorePath } from '../../fs-watch/fs-watch-rebuild';
import { validateConfig } from '../validate-config';

describe('validation', () => {
  let userConfig: d.Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    userConfig = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      namespace: 'Testing',
    };
  });

  describe('allowInlineScripts', () => {
    it('set allowInlineScripts true', () => {
      userConfig.allowInlineScripts = true;
      const { config } = validateConfig(userConfig);
      expect(config.allowInlineScripts).toBe(true);
    });

    it('set allowInlineScripts false', () => {
      userConfig.allowInlineScripts = false;
      const { config } = validateConfig(userConfig);
      expect(config.allowInlineScripts).toBe(false);
    });

    it('default allowInlineScripts true', () => {
      const { config } = validateConfig(userConfig);
      expect(config.allowInlineScripts).toBe(true);
    });
  });

  describe('enableCache', () => {
    it('set enableCache true', () => {
      userConfig.enableCache = true;
      const { config } = validateConfig(userConfig);
      expect(config.enableCache).toBe(true);
    });

    it('set enableCache false', () => {
      userConfig.enableCache = false;
      const { config } = validateConfig(userConfig);
      expect(config.enableCache).toBe(false);
    });

    it('default enableCache true', () => {
      const { config } = validateConfig(userConfig);
      expect(config.enableCache).toBe(true);
    });
  });

  describe('buildAppCore', () => {
    it('set buildAppCore true', () => {
      userConfig.buildAppCore = true;
      const { config } = validateConfig(userConfig);
      expect(config.buildAppCore).toBe(true);
    });

    it('set buildAppCore false', () => {
      userConfig.buildAppCore = false;
      const { config } = validateConfig(userConfig);
      expect(config.buildAppCore).toBe(false);
    });

    it('default buildAppCore true', () => {
      const { config } = validateConfig(userConfig);
      expect(config.buildAppCore).toBe(true);
    });
  });

  describe('es5 build', () => {
    it('set buildEs5 false', () => {
      userConfig.buildEs5 = false;
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(false);
    });

    it('set buildEs5 true', () => {
      userConfig.buildEs5 = true;
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(true);
    });

    it('set buildEs5 true, dev mode', () => {
      userConfig.devMode = true;
      userConfig.buildEs5 = true;
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(true);
    });

    it('prod mode, set modern and es5', () => {
      userConfig.devMode = false;
      userConfig.buildEs5 = true;
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(true);
    });

    it('build es5 when set to "prod" and in prod', () => {
      userConfig.devMode = false;
      userConfig.buildEs5 = 'prod';
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(true);
    });

    it('do not build es5 when set to "prod" and in dev', () => {
      userConfig.devMode = true;
      userConfig.buildEs5 = 'prod';
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(false);
    });

    it('prod mode default to only modern and not es5', () => {
      userConfig.devMode = false;
      const { config } = validateConfig(userConfig);
      expect(config.buildEs5).toBe(false);
    });
  });

  describe('hashed filenames', () => {
    it('should error when hashedFileNameLength too large', () => {
      userConfig.hashedFileNameLength = 33;
      const validated = validateConfig(userConfig);
      expect(validated.diagnostics).toHaveLength(1);
    });

    it('should error when hashedFileNameLength too small', () => {
      userConfig.hashedFileNameLength = 3;
      const validated = validateConfig(userConfig);
      expect(validated.diagnostics).toHaveLength(1);
    });

    it('should set from hashedFileNameLength', () => {
      userConfig.hashedFileNameLength = 28;
      const validated = validateConfig(userConfig);
      expect(validated.config.hashedFileNameLength).toBe(28);
    });

    it('should set hashedFileNameLength', () => {
      userConfig.hashedFileNameLength = 6;
      const { config } = validateConfig(userConfig);
      expect(config.hashedFileNameLength).toBe(6);
    });

    it('should default hashedFileNameLength', () => {
      const { config } = validateConfig(userConfig);
      expect(config.hashedFileNameLength).toBe(8);
    });

    it('should default hashFileNames to false in watch mode despite prod mode', () => {
      userConfig.watch = true;
      userConfig.devMode = false;
      const { config } = validateConfig(userConfig);
      expect(config.hashFileNames).toBe(true);
    });

    it('should default hashFileNames to true in prod mode', () => {
      userConfig.devMode = false;
      const { config } = validateConfig(userConfig);
      expect(config.hashFileNames).toBe(true);
    });

    it('should default hashFileNames to false in dev mode', () => {
      userConfig.devMode = true;
      const { config } = validateConfig(userConfig);
      expect(config.hashFileNames).toBe(false);
    });

    it('should set hashFileNames from hashFilenames', () => {
      userConfig.hashFileNames = false;
      const { config } = validateConfig(userConfig);
      expect(config.hashFileNames).toBe(false);
    });

    it('should set hashFileNames from hashFilenames', () => {
      userConfig.hashFileNames = true;
      const { config } = validateConfig(userConfig);
      expect(config.hashFileNames).toBe(true);
    });

    it('should set hashFileNames from function', () => {
      (userConfig as any).hashFileNames = () => {
        return true;
      };
      const { config } = validateConfig(userConfig);
      expect(config.hashFileNames).toBe(true);
    });
  });

  describe('minifyJs', () => {
    it('should set minifyJs to true', () => {
      userConfig.devMode = true;
      userConfig.minifyJs = true;
      const { config } = validateConfig(userConfig);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to true in prod mode', () => {
      userConfig.devMode = false;
      const { config } = validateConfig(userConfig);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to false in dev mode', () => {
      userConfig.devMode = true;
      const { config } = validateConfig(userConfig);
      expect(config.minifyJs).toBe(false);
    });
  });

  describe('minifyCss', () => {
    it('should set minifyCss to true', () => {
      userConfig.devMode = true;
      userConfig.minifyCss = true;
      const { config } = validateConfig(userConfig);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to true in prod mode', () => {
      userConfig.devMode = false;
      const { config } = validateConfig(userConfig);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to false in dev mode', () => {
      userConfig.devMode = true;
      const { config } = validateConfig(userConfig);
      expect(config.minifyCss).toBe(false);
    });
  });

  it('should default watch to false', () => {
    const { config } = validateConfig(userConfig);
    expect(config.watch).toBe(false);
  });

  it('should set devMode to false', () => {
    userConfig.devMode = false;
    const { config } = validateConfig(userConfig);
    expect(config.devMode).toBe(false);
  });

  it('should set devMode to true', () => {
    userConfig.devMode = true;
    const { config } = validateConfig(userConfig);
    expect(config.devMode).toBe(true);
  });

  it('should default devMode to false', () => {
    const { config } = validateConfig(userConfig);
    expect(config.devMode).toBe(false);
  });

  it('should set default generateDocs to false', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(false);
  });

  it('should default dist false and www true', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

  it('should set devInspector false', () => {
    userConfig.devInspector = false;
    const { config } = validateConfig(userConfig);
    expect(config.devInspector).toBe(false);
  });

  it('should set devInspector true ', () => {
    userConfig.devInspector = true;
    const { config } = validateConfig(userConfig);
    expect(config.devInspector).toBe(true);
  });

  it('should default devInspector false when devMode is false', () => {
    userConfig.devMode = false;
    const { config } = validateConfig(userConfig);
    expect(config.devInspector).toBe(false);
  });

  it('should default devInspector true when devMode is true', () => {
    userConfig.devMode = true;
    const { config } = validateConfig(userConfig);
    expect(config.devInspector).toBe(true);
  });

  it('should set default generateDocs to false', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(false);
  });

  it('should default dist false and www true', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

  it('should error for invalid outputTarget type', () => {
    userConfig.outputTargets = [
      {
        type: 'whatever',
      } as any,
    ];
    const validated = validateConfig(userConfig);
    expect(validated.diagnostics).toHaveLength(1);
  });

  it('should default outputTargets with www', () => {
    const { config } = validateConfig(userConfig);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

  it('should set extras defaults', () => {
    const { config } = validateConfig(userConfig);
    expect(config.extras.appendChildSlotFix).toBe(false);
    expect(config.extras.cloneNodeFix).toBe(false);
    expect(config.extras.cssVarsShim).toBe(false);
    expect(config.extras.dynamicImportShim).toBe(false);
    expect(config.extras.lifecycleDOMEvents).toBe(false);
    expect(config.extras.safari10).toBe(false);
    expect(config.extras.scriptDataOpts).toBe(false);
    expect(config.extras.shadowDomShim).toBe(false);
    expect(config.extras.slotChildNodesFix).toBe(false);
    expect(config.extras.initializeNextTick).toBe(false);
    expect(config.extras.tagNameTransform).toBe(false);
  });

  it('should set taskQueue "async" by default', () => {
    const { config } = validateConfig(userConfig);
    expect(config.taskQueue).toBe('async');
  });

  it('should set taskQueue', () => {
    userConfig.taskQueue = 'congestionAsync';
    const { config } = validateConfig(userConfig);
    expect(config.taskQueue).toBe('congestionAsync');
  });

  it('empty watchIgnoredRegex, all valid', () => {
    const { config } = validateConfig(userConfig);
    expect(config.watchIgnoredRegex).toEqual([]);
    expect(isWatchIgnorePath(config, '/some/image.gif')).toBe(false);
    expect(isWatchIgnorePath(config, '/some/typescript.ts')).toBe(false);
  });

  it('should change a single watchIgnoredRegex to an array', () => {
    userConfig.watchIgnoredRegex = /\.(gif|jpe?g|png)$/i;
    const { config } = validateConfig(userConfig);
    expect(config.watchIgnoredRegex).toHaveLength(1);
    expect((config.watchIgnoredRegex as any[])[0]).toEqual(/\.(gif|jpe?g|png)$/i);
    expect(isWatchIgnorePath(config, '/some/image.gif')).toBe(true);
    expect(isWatchIgnorePath(config, '/some/typescript.ts')).toBe(false);
  });

  it('should clean up valid watchIgnoredRegex', () => {
    userConfig.watchIgnoredRegex = [/\.(gif|jpe?g)$/i, null, 'me-regex' as any, /\.(png)$/i];
    const { config } = validateConfig(userConfig);
    expect(config.watchIgnoredRegex).toHaveLength(2);
    expect((config.watchIgnoredRegex as any[])[0]).toEqual(/\.(gif|jpe?g)$/i);
    expect((config.watchIgnoredRegex as any[])[1]).toEqual(/\.(png)$/i);
    expect(isWatchIgnorePath(config, '/some/image.gif')).toBe(true);
    expect(isWatchIgnorePath(config, '/some/image.jpg')).toBe(true);
    expect(isWatchIgnorePath(config, '/some/image.png')).toBe(true);
    expect(isWatchIgnorePath(config, '/some/typescript.ts')).toBe(false);
  });

  describe('sourceMap', () => {
    it('set sourceMap true', () => {
      userConfig.sourceMap = true;
      const { config } = validateConfig(userConfig);
      expect(config.sourceMap).toBe(true);
    });

    it('set sourceMap false', () => {
      userConfig.sourceMap = false;
      const { config } = validateConfig(userConfig);
      expect(config.sourceMap).toBe(false);
    });

    it('default sourceMap undefined', () => {
      const { config } = validateConfig(userConfig);
      expect(config.sourceMap).toBe(undefined);
    });
  });
});
