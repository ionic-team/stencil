import * as d from '@stencil/core/declarations';
import { mockLogger, mockStencilSystem } from '@stencil/core/testing';
import { setProcessEnvironment, validateConfig } from '../validate-config';
import { normalizePath } from '@stencil/core/utils';


describe('validation', () => {

  let config: d.Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      namespace: 'Testing'
    };
  });


  describe('enableCache', () => {

    it('set enableCache true', () => {
      config.enableCache = true;
      validateConfig(config, [], false);
      expect(config.enableCache).toBe(true);
    });

    it('set enableCache false', () => {
      config.enableCache = false;
      validateConfig(config, [], false);
      expect(config.enableCache).toBe(false);
    });

    it('default enableCache true', () => {
      validateConfig(config, [], false);
      expect(config.enableCache).toBe(true);
    });

  });

  describe('buildAppCore', () => {

    it('set buildAppCore true', () => {
      config.buildAppCore = true;
      validateConfig(config, [], false);
      expect(config.buildAppCore).toBe(true);
    });

    it('set buildAppCore false', () => {
      config.buildAppCore = false;
      validateConfig(config, [], false);
      expect(config.buildAppCore).toBe(false);
    });

    it('default buildAppCore true', () => {
      validateConfig(config, [], false);
      expect(config.buildAppCore).toBe(true);
    });

  });

  describe('es5 build', () => {

    it('set buildEs5 false', () => {
      config.buildEs5 = false;
      validateConfig(config, [], false);
      expect(config.buildEs5).toBe(false);
    });

    it('set buildEs5 true', () => {
      config.buildEs5 = true;
      validateConfig(config, [], false);
      expect(config.buildEs5).toBe(true);
    });

    it('prod mode default to both es2017 and es5', () => {
      config.devMode = false;
      validateConfig(config, [], false);
      expect(config.buildEs5).toBe(true);
    });

    it('dev mode default to only es2017', () => {
      config.devMode = true;
      validateConfig(config, [], false);
      expect(config.buildEs5).toBe(false);
    });

  });


  describe('include/exclude globs', () => {

    it('should default include glob', () => {
      validateConfig(config, [], false);
      const normalizedIncludeSrc = config.includeSrc.map(x => normalizePath(x));
      expect(normalizedIncludeSrc).toEqual([
        '/User/some/path/src/**/*.ts',
        '/User/some/path/src/**/*.tsx'
      ]);
    });

    it('should default exclude glob', () => {
      validateConfig(config, [], false);
      expect(config.excludeSrc).toEqual(['/User/some/path/src/**/test/**']);
    });

  });


  describe('hashed filenames', () => {

    it('should error when hashedFileNameLength too large', () => {
      config.hashedFileNameLength = 33;
      const diagnostics: d.Diagnostic[] = [];
      validateConfig(config, diagnostics, false);
      expect(diagnostics).toHaveLength(1);
    });

    it('should error when hashedFileNameLength too small', () => {
      config.hashedFileNameLength = 3;
      const diagnostics: d.Diagnostic[] = [];
      validateConfig(config, diagnostics, false);
      expect(diagnostics).toHaveLength(1);
    });

    it('should set from hashedfilenamelength', () => {
      (config as any).hashedfilenamelength = 28;
      validateConfig(config, [], false);
      expect(config.hashedFileNameLength).toBe(28);
    });

    it('should set hashedFileNameLength from function', () => {
      (config as any).hashedfilenamelength = () => 11;
      validateConfig(config, [], false);
      expect(config.hashedFileNameLength).toBe(11);
    });

    it('should set hashedFileNameLength', () => {
      config.hashedFileNameLength = 6;
      validateConfig(config, [], false);
      expect(config.hashedFileNameLength).toBe(6);
    });

    it('should default hashedFileNameLength', () => {
      validateConfig(config, [], false);
      expect(config.hashedFileNameLength).toBe(8);
    });

    it('should default hashFileNames to false in watch mode despite prod mode', () => {
      config.watch = true;
      config.devMode = false;
      validateConfig(config, [], false);
      expect(config.hashFileNames).toBe(true);
    });

    it('should default hashFileNames to true in prod mode', () => {
      config.devMode = false;
      validateConfig(config, [], false);
      expect(config.hashFileNames).toBe(true);
    });

    it('should default hashFileNames to false in dev mode', () => {
      config.devMode = true;
      validateConfig(config, [], false);
      expect(config.hashFileNames).toBe(false);
    });

    it('should set hashFileNames from hashFilenames', () => {
      (config as any).hashFilenames = false;
      validateConfig(config, [], false);
      expect(config.hashFileNames).toBe(false);
    });

    it('should set hashFileNames from hashFilenames', () => {
      (config as any).hashFilenames = true;
      validateConfig(config, [], false);
      expect(config.hashFileNames).toBe(true);
    });

    it('should set hashFileNames from function', () => {
      (config as any).hashFileNames = () => {
        return true;
      };
      validateConfig(config, [], false);
      expect(config.hashFileNames).toBe(true);
    });

  });


  describe('minifyJs', () => {

    it('should set minifyJs to true', () => {
      config.devMode = true;
      config.minifyJs = true;
      validateConfig(config, [], false);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to true in prod mode', () => {
      config.devMode = false;
      validateConfig(config, [], false);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to false in dev mode', () => {
      config.devMode = true;
      validateConfig(config, [], false);
      expect(config.minifyJs).toBe(false);
    });

  });


  describe('minifyCss', () => {

    it('should set minifyCss to true', () => {
      config.devMode = true;
      config.minifyCss = true;
      validateConfig(config, [], false);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to true in prod mode', () => {
      config.devMode = false;
      validateConfig(config, [], false);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to false in dev mode', () => {
      config.devMode = true;
      validateConfig(config, [], false);
      expect(config.minifyCss).toBe(false);
    });

  });

  describe('setProcessEnvironment', () => {

    it('should set NODE_ENV production', () => {
      config.devMode = false;
      setProcessEnvironment(config);
      expect(process.env.NODE_ENV).toBe('production');
    });

    it('should set NODE_ENV development', () => {
      config.devMode = true;
      setProcessEnvironment(config);
      expect(process.env.NODE_ENV).toBe('development');
    });

  });

  it('should default watch to false', () => {
    validateConfig(config, [], false);
    expect(config.watch).toBe(false);
  });

  it('should set devMode to false', () => {
    config.devMode = false;
    validateConfig(config, [], false);
    expect(config.devMode).toBe(false);
  });

  it('should set devMode to true', () => {
    config.devMode = true;
    validateConfig(config, [], false);
    expect(config.devMode).toBe(true);
  });

  it('should default devMode to false', () => {
    validateConfig(config, [], false);
    expect(config.devMode).toBe(false);
  });

  it('should set default generateDocs to false', () => {
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(false);
  });

  it('should default dist false and www true', () => {
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

  it('should require at least one output target', () => {

    config.outputTargets = [];
    const diagnostics: d.Diagnostic[] = [];
    validateConfig(config, diagnostics, false);
    expect(diagnostics).toHaveLength(1);

  });

  it('should set devInspector false', () => {
    config.devInspector = false;
    validateConfig(config, [], false);
    expect(config.devInspector).toBe(false);
  });

  it('should set devInspector true ', () => {
    config.devInspector = true;
    validateConfig(config, [], false);
    expect(config.devInspector).toBe(true);
  });

  it('should default devInspector false when devMode is false', () => {
    config.devMode = false;
    validateConfig(config, [], false);
    expect(config.devInspector).toBe(false);
  });

  it('should default devInspector true when devMode is true', () => {
    config.devMode = true;
    validateConfig(config, [], false);
    expect(config.devInspector).toBe(true);
  });

  it('should set default generateDocs to false', () => {
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'docs')).toBe(false);
  });

  it('should default dist false and www true', () => {
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'dist')).toBe(false);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

  it('should require at least one output target', () => {
    config.outputTargets = [];
    const diagnostics: d.Diagnostic[] = [];
    validateConfig(config, diagnostics, false);
    expect(diagnostics).toHaveLength(1);
  });

  it('should error for invalid outputTarget type', () => {
    config.outputTargets = [
      {
        type: 'whatever'
      } as any
    ];
    const diagnostics: d.Diagnostic[] = [];
    validateConfig(config, diagnostics, false);
    expect(diagnostics).toHaveLength(1);
  });

  it('should default add www type to outputTarget', () => {
    config.outputTargets = [
      {
        dir: 'somedir'
      } as d.OutputTargetWww
    ];
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

  it('should default outputTargets with www', () => {
    validateConfig(config, [], false);
    expect(config.outputTargets.some(o => o.type === 'www')).toBe(true);
  });

});
