import { Config } from '../../../util/interfaces';
import { mockLogger, mockStencilSystem } from '../../../testing/mocks';
import { setProcessEnvironment, validateBuildConfig } from '../validate-config';
import * as path from 'path';


describe('validation', () => {

  describe('enableCache', () => {

    it('set enableCache true', () => {
      config.enableCache = true;
      validateBuildConfig(config);
      expect(config.enableCache).toBe(true);
    });

    it('set enableCache false', () => {
      config.enableCache = false;
      validateBuildConfig(config);
      expect(config.enableCache).toBe(false);
    });

    it('default enableCache false', () => {
      validateBuildConfig(config);
      expect(config.enableCache).toBe(false);
    });

  });

  describe('buildAppCore', () => {

    it('set buildAppCore true', () => {
      config.buildStats = true;
      validateBuildConfig(config);
      expect(config.buildAppCore).toBe(true);
    });

    it('set buildAppCore false', () => {
      config.buildAppCore = false;
      validateBuildConfig(config);
      expect(config.buildAppCore).toBe(false);
    });

    it('default buildAppCore true', () => {
      validateBuildConfig(config);
      expect(config.buildAppCore).toBe(true);
    });

  });

  describe('buildStats', () => {

    it('set buildStats true', () => {
      config.buildStats = true;
      validateBuildConfig(config);
      expect(config.buildStats).toBe(true);
    });

    it('set buildStats false', () => {
      config.buildStats = false;
      validateBuildConfig(config);
      expect(config.buildStats).toBe(false);
    });

    it('default buildStats false', () => {
      validateBuildConfig(config);
      expect(config.buildStats).toBe(false);
    });

  });

  describe('es5 build', () => {

    it('set buildEs5 false', () => {
      config.buildEs5 = false;
      validateBuildConfig(config);
      expect(config.buildEs5).toBe(false);
    });

    it('set buildEs5 true', () => {
      config.buildEs5 = true;
      validateBuildConfig(config);
      expect(config.buildEs5).toBe(true);
    });

    it('prod mode default to both es2015 and es5', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.buildEs5).toBe(true);
    });

    it('dev mode default to only es2015', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.buildEs5).toBe(false);
    });

  });


  describe('include/exclude globs', () => {

    it('should default include glob', () => {
      validateBuildConfig(config);
      expect(config.includeSrc).toEqual([
        '/User/some/path/src/**/*.ts',
        '/User/some/path/src/**/*.tsx'
      ]);
    });

    it('should default exclude glob', () => {
      validateBuildConfig(config);
      expect(config.excludeSrc).toEqual(['**/test/**', '**/*.spec.*']);
    });

  });


  describe('hydrate css', () => {

    it('should set hydratedCssClass', () => {
      config.hydratedCssClass = '💎';
      validateBuildConfig(config);
      expect(config.hydratedCssClass).toBe('💎');
    });

    it('should default hydratedCssClass', () => {
      validateBuildConfig(config);
      expect(config.hydratedCssClass).toBe('hydrated');
    });

  });


  describe('hashed filenames', () => {

    it('should throw error when hashedFileNameLength to small', () => {
      expect(() => {
        config.hashedFileNameLength = 3;
        validateBuildConfig(config);
      }).toThrow();
    });

    it('should set hashedFileNameLength', () => {
      config.hashedFileNameLength = 6;
      validateBuildConfig(config);
      expect(config.hashedFileNameLength).toBe(6);
    });

    it('should default hashedFileNameLength', () => {
      validateBuildConfig(config);
      expect(config.hashedFileNameLength).toBe(8);
    });

    it('should default hashFileNames to false in watch mode despite prod mode', () => {
      config.watch = true;
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(false);
    });

    it('should default hashFileNames to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(true);
    });

    it('should default hashFileNames to false in dev mode', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(false);
    });

    it('should set hashFileNames from hashFilenames', () => {
      (config as any).hashFilenames = false;
      validateBuildConfig(config);
      expect(config.hashFileNames).toBe(false);
    });

  });


  describe('minifyJs', () => {

    it('should set minifyJs to true', () => {
      config.devMode = true;
      config.minifyJs = true;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(true);
    });

    it('should default minifyJs to false in dev mode', () => {
      config.devMode = true;
      validateBuildConfig(config);
      expect(config.minifyJs).toBe(false);
    });

  });


  describe('minifyCss', () => {

    it('should set minifyCss to true', () => {
      config.devMode = true;
      config.minifyCss = true;
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to true in prod mode', () => {
      config.devMode = false;
      validateBuildConfig(config);
      expect(config.minifyCss).toBe(true);
    });

    it('should default minifyCss to false in dev mode', () => {
      config.devMode = true;
      validateBuildConfig(config);
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
    validateBuildConfig(config);
    expect(config.watch).toBe(false);
  });

  it('should set devMode to false', () => {
    config.devMode = false;
    validateBuildConfig(config);
    expect(config.devMode).toBe(false);
  });

  it('should set devMode to true', () => {
    config.devMode = true;
    validateBuildConfig(config);
    expect(config.devMode).toBe(true);
  });

  it('should default devMode to false', () => {
    validateBuildConfig(config);
    expect(config.devMode).toBe(false);
  });

  it('should set default generateDocs to false', () => {
    validateBuildConfig(config);
    expect(config.generateDocs).toBe(false);
  });

  it('should set generateDocs to true', () => {
    config.generateDocs = true;
    validateBuildConfig(config);
    expect(config.generateDocs).toBe(true);
  });

  it('should set generateDistribution to true', () => {
    config.generateDistribution = true;
    validateBuildConfig(config);
    expect(config.generateDistribution).toBe(true);
  });

  it('should default generateDistribution to false', () => {
    validateBuildConfig(config);
    expect(config.generateDistribution).toBe(false);
  });

  it('should set generateWWW to false', () => {
    config.generateWWW = false;
    validateBuildConfig(config);
    expect(config.generateWWW).toBe(false);
  });

  it('should default generateWWW to true', () => {
    validateBuildConfig(config);
    expect(config.generateWWW).toBe(true);
  });

  var config: Config;
  const logger = mockLogger();
  const sys = mockStencilSystem();

  beforeEach(() => {
    config = {
      sys: sys,
      logger: logger,
      rootDir: '/User/some/path/',
      suppressTypeScriptErrors: true
    };
  });

});
